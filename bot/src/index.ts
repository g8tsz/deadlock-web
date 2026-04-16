import {
  Client,
  GatewayIntentBits,
  PermissionFlagsBits,
  REST,
  Routes,
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  type GuildMember,
} from "discord.js";

const token = process.env.DISCORD_BOT_TOKEN?.trim();
const guildId = process.env.DISCORD_GUILD_ID?.trim();
const clientId = process.env.DISCORD_CLIENT_ID?.trim();
const baseUrl = process.env.INGEST_BASE_URL?.replace(/\/$/, "") ?? "";
const ingestSecret = process.env.BOT_INGEST_SECRET?.trim();
const adminRoleIds = (process.env.DISCORD_ADMIN_ROLE_IDS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

function requireEnv(): string | null {
  if (!token) return "DISCORD_BOT_TOKEN";
  if (!clientId) return "DISCORD_CLIENT_ID (application id for REST)";
  if (!baseUrl) return "INGEST_BASE_URL";
  if (!ingestSecret) return "BOT_INGEST_SECRET";
  return null;
}

function canUseIngest(member: GuildMember | null): boolean {
  if (!member) return false;
  if (adminRoleIds.length > 0) {
    return adminRoleIds.some((id) => member.roles.cache.has(id));
  }
  return member.permissions.has(PermissionFlagsBits.Administrator);
}

async function postIngest(path: string, body: unknown): Promise<{ ok: boolean; text: string; status: number }> {
  const res = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ingestSecret}`,
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  return { ok: res.ok, text, status: res.status };
}

const commands = [
  new SlashCommandBuilder()
    .setName("cdc-help")
    .setDescription("College Deadlock ingest bot — how to use /cdc-match and standings"),
  new SlashCommandBuilder()
    .setName("cdc-match")
    .setDescription("Create or update a match on the website")
    .addStringOption((o) => o.setName("event_slug").setDescription("Event slug, e.g. season-0").setRequired(true))
    .addStringOption((o) => o.setName("team1_school_slug").setDescription("School slug").setRequired(true))
    .addStringOption((o) => o.setName("team1_school_name").setDescription("School display name").setRequired(true))
    .addStringOption((o) => o.setName("team1_tag").setDescription("Team tag, e.g. NU").setRequired(true))
    .addStringOption((o) => o.setName("team1_full").setDescription("Team full name").setRequired(true))
    .addStringOption((o) => o.setName("team2_school_slug").setDescription("School slug").setRequired(true))
    .addStringOption((o) => o.setName("team2_school_name").setDescription("School display name").setRequired(true))
    .addStringOption((o) => o.setName("team2_tag").setDescription("Team tag").setRequired(true))
    .addStringOption((o) => o.setName("team2_full").setDescription("Team full name").setRequired(true))
    .addStringOption((o) => o.setName("scheduled_iso").setDescription("ISO datetime, e.g. 2025-02-13T21:00:00.000Z").setRequired(true))
    .addStringOption((o) => o.setName("label").setDescription("e.g. Week 2").setRequired(false))
    .addStringOption((o) => o.setName("match_id").setDescription("Existing match id to update").setRequired(false))
    .addIntegerOption((o) => o.setName("score_team1").setDescription("Score team 1 (omit for VS)").setRequired(false))
    .addIntegerOption((o) => o.setName("score_team2").setDescription("Score team 2").setRequired(false)),
  new SlashCommandBuilder()
    .setName("cdc-standings-row")
    .setDescription("Upsert one row in event standings")
    .addStringOption((o) => o.setName("event_slug").setDescription("Event slug").setRequired(true))
    .addStringOption((o) => o.setName("school_slug").setDescription("School slug").setRequired(true))
    .addStringOption((o) => o.setName("school_name").setDescription("School name").setRequired(true))
    .addStringOption((o) => o.setName("team_tag").setDescription("Team tag").setRequired(true))
    .addStringOption((o) => o.setName("team_full").setDescription("Team full name").setRequired(true))
    .addIntegerOption((o) => o.setName("placement").setDescription("League placement").setRequired(false))
    .addNumberOption((o) => o.setName("score").setDescription("Standing score").setRequired(false))
    .addNumberOption((o) => o.setName("seed").setDescription("Seed number").setRequired(false))
    .addStringOption((o) => o.setName("rank_label").setDescription("e.g. Eternus 6").setRequired(false))
    .addStringOption((o) => o.setName("group_name").setDescription("Group 1 or Group 2").setRequired(false))
    .addIntegerOption((o) => o.setName("display_order").setDescription("Manual sort override").setRequired(false)),
].map((c) => c.toJSON());

async function handleMatch(interaction: ChatInputCommandInteraction) {
  const eventSlug = interaction.options.getString("event_slug", true);
  const matchId = interaction.options.getString("match_id") ?? undefined;
  const payload = {
    eventSlug,
    matchId,
    team1: {
      schoolSlug: interaction.options.getString("team1_school_slug", true),
      schoolName: interaction.options.getString("team1_school_name", true),
      tag: interaction.options.getString("team1_tag", true),
      fullName: interaction.options.getString("team1_full", true),
      logoUrl: null,
    },
    team2: {
      schoolSlug: interaction.options.getString("team2_school_slug", true),
      schoolName: interaction.options.getString("team2_school_name", true),
      tag: interaction.options.getString("team2_tag", true),
      fullName: interaction.options.getString("team2_full", true),
      logoUrl: null,
    },
    scheduledAt: interaction.options.getString("scheduled_iso", true),
    label: interaction.options.getString("label"),
    score1: interaction.options.getInteger("score_team1"),
    score2: interaction.options.getInteger("score_team2"),
    streamUrl: null,
    vodUrl: null,
  };

  const result = await postIngest("/api/ingest/match", payload);
  if (!result.ok) {
    await interaction.editReply({ content: `Failed (${result.status}): ${result.text.slice(0, 1800)}` });
    return;
  }
  await interaction.editReply({ content: `OK: ${result.text}` });
}

async function handleStandingsRow(interaction: ChatInputCommandInteraction) {
  const row = {
    schoolSlug: interaction.options.getString("school_slug", true),
    schoolName: interaction.options.getString("school_name", true),
    teamTag: interaction.options.getString("team_tag", true),
    teamFullName: interaction.options.getString("team_full", true),
    teamLogoUrl: null,
    placement: interaction.options.getInteger("placement"),
    score: interaction.options.getNumber("score"),
    seed: interaction.options.getNumber("seed"),
    rankLabel: interaction.options.getString("rank_label"),
    groupName: interaction.options.getString("group_name"),
    displayOrder: interaction.options.getInteger("display_order"),
  };

  const payload = {
    eventSlug: interaction.options.getString("event_slug", true),
    rows: [row],
  };

  const result = await postIngest("/api/ingest/standings", payload);
  if (!result.ok) {
    await interaction.editReply({ content: `Failed (${result.status}): ${result.text.slice(0, 1800)}` });
    return;
  }
  await interaction.editReply({ content: `OK: ${result.text}` });
}

async function main() {
  const missing = requireEnv();
  if (missing) {
    console.error(`Missing env: ${missing}`);
    process.exit(1);
  }

  const rest = new REST({ version: "10" }).setToken(token!);
  if (guildId) {
    await rest.put(Routes.applicationGuildCommands(clientId!, guildId), { body: commands });
    console.log(`Registered guild commands in ${guildId}`);
  } else {
    await rest.put(Routes.applicationCommands(clientId!), { body: commands });
    console.log("Registered global commands (may take up to an hour to appear)");
  }

  const client = new Client({ intents: [GatewayIntentBits.Guilds] });

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const member = interaction.member as GuildMember | null;
    if (!canUseIngest(member)) {
      await interaction.reply({ content: "You do not have permission to run this command.", ephemeral: true });
      return;
    }

    try {
      if (interaction.commandName === "cdc-help") {
        await interaction.reply({
          content:
            "**cdc-match** — Fill event slug, both teams (school slug, name, tag, full name), `scheduled_iso` (UTC ISO string). Optional: label, scores, match_id to update.\n" +
            "**cdc-standings-row** — One standings row for an event (placement, score, group, etc.).\n" +
            "Website must have `BOT_INGEST_SECRET` set; bot uses `INGEST_BASE_URL` + Bearer token.",
          ephemeral: true,
        });
        return;
      }
      if (interaction.commandName === "cdc-match") {
        await interaction.deferReply({ ephemeral: true });
        await handleMatch(interaction);
        return;
      }
      if (interaction.commandName === "cdc-standings-row") {
        await interaction.deferReply({ ephemeral: true });
        await handleStandingsRow(interaction);
        return;
      }
    } catch (e) {
      console.error(e);
      const msg = e instanceof Error ? e.message : "Unknown error";
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply({ content: `Error: ${msg.slice(0, 1800)}` });
      } else {
        await interaction.reply({ content: `Error: ${msg.slice(0, 1800)}`, ephemeral: true });
      }
    }
  });

  await client.login(token!);
  console.log("Bot logged in");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
