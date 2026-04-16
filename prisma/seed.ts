import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const schoolsData: Array<{
  name: string;
  slug: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  thisSeason: boolean;
}> = [
  { name: "University of Toronto", slug: "uoft", city: "Toronto", state: "ON", lat: 43.6629, lng: -79.3957, thisSeason: false },
  { name: "Northwood University", slug: "northwood", city: "Midland", state: "MI", lat: 43.6156, lng: -84.2472, thisSeason: false },
  { name: "George Mason University", slug: "gmu", city: "Fairfax", state: "VA", lat: 38.8298, lng: -77.3074, thisSeason: false },
  { name: "Texas A&M University", slug: "tamu", city: "College Station", state: "TX", lat: 30.628, lng: -96.3344, thisSeason: false },
  { name: "Colorado State University", slug: "csu", city: "Fort Collins", state: "CO", lat: 40.5762, lng: -105.0807, thisSeason: false },
  { name: "Penn State University", slug: "psu", city: "State College", state: "PA", lat: 40.7982, lng: -77.8599, thisSeason: false },
  { name: "University of Nebraska-Lincoln", slug: "unl", city: "Lincoln", state: "NE", lat: 40.8202, lng: -96.7005, thisSeason: false },
  { name: "University of Maryland", slug: "umd", city: "College Park", state: "MD", lat: 38.9869, lng: -76.9426, thisSeason: true },
  { name: "Seattle University", slug: "seattle-u", city: "Seattle", state: "WA", lat: 47.6062, lng: -122.3321, thisSeason: true },
  { name: "Rochester Institute of Technology", slug: "rit", city: "Rochester", state: "NY", lat: 43.0846, lng: -77.6744, thisSeason: true },
  { name: "University of Illinois Chicago", slug: "uic", city: "Chicago", state: "IL", lat: 41.8756, lng: -87.6244, thisSeason: true },
  { name: "Champlain College", slug: "champlain", city: "Burlington", state: "VT", lat: 44.4759, lng: -73.2121, thisSeason: true },
  { name: "University of North Alabama", slug: "una", city: "Florence", state: "AL", lat: 34.7998, lng: -87.6773, thisSeason: true },
  { name: "Macalester College", slug: "macalester", city: "Saint Paul", state: "MN", lat: 44.9397, lng: -93.1688, thisSeason: true },
  { name: "Purdue University", slug: "purdue", city: "West Lafayette", state: "IN", lat: 40.4237, lng: -86.9212, thisSeason: false },
  { name: "Georgia Institute of Technology", slug: "gatech", city: "Atlanta", state: "GA", lat: 33.7756, lng: -84.3963, thisSeason: false },
  { name: "Clemson University", slug: "clemson", city: "Clemson", state: "SC", lat: 34.6788, lng: -82.8365, thisSeason: false },
  { name: "Iowa State University", slug: "iowa-state", city: "Ames", state: "IA", lat: 42.0264, lng: -93.646, thisSeason: false },
  { name: "University of New Mexico", slug: "unm", city: "Albuquerque", state: "NM", lat: 35.0844, lng: -106.6504, thisSeason: false },
  { name: "Drexel University", slug: "drexel", city: "Philadelphia", state: "PA", lat: 39.9566, lng: -75.1899, thisSeason: false },
  { name: "Minnesota State University", slug: "mnsu", city: "Mankato", state: "MN", lat: 44.1636, lng: -93.9994, thisSeason: true },
];

async function main() {
  console.log("Seeding database...");

  for (const s of schoolsData) {
    await prisma.school.upsert({
      where: { slug: s.slug },
      create: {
        name: s.name,
        slug: s.slug,
        city: s.city,
        state: s.state,
        country: "USA",
        lat: s.lat,
        lng: s.lng,
        thisSeason: s.thisSeason,
      },
      update: { lat: s.lat, lng: s.lng, thisSeason: s.thisSeason },
    });
  }

  await prisma.event.updateMany({ data: { isCurrent: false } });
  let event = await prisma.event.findFirst({ where: { slug: "season-0" } });
  if (!event) {
    event = await prisma.event.create({
      data: {
        name: "DCS Season 0",
        slug: "season-0",
        startDate: new Date("2025-02-01"),
        endDate: new Date("2025-03-31"),
        type: "season",
        description: "Deadlock Collegiate Series Season 0. Top schools compete across North America.",
        isCurrent: true,
      },
    });
  } else {
    await prisma.event.update({ where: { id: event.id }, data: { isCurrent: true } });
  }

  const teamSpecs = [
    { schoolSlug: "northwood", tag: "NU", fullName: "Northwood Timberwolves", cap1: "crimz", cap2: "blurence", staff: "slew." },
    { schoolSlug: "unl", tag: "UNL", fullName: "Nebraska Esports", cap1: "artik3398", cap2: "shromo_ow", staff: "bluemilkgg" },
    { schoolSlug: "gmu", tag: "GMU", fullName: "George Mason Patriots", cap1: "jonnywithnoh", cap2: "fooncy", staff: "Staff" },
    { schoolSlug: "psu", tag: "PSU", fullName: "PSU Deadlock", cap1: "tinymou", cap2: "datsolo", staff: "wiisportsmusic_" },
  ];

  for (const t of teamSpecs) {
    const school = await prisma.school.findUnique({ where: { slug: t.schoolSlug } });
    if (!school) continue;
    let team = await prisma.team.findFirst({ where: { schoolId: school.id, tag: t.tag } });
    if (!team) {
      team = await prisma.team.create({
        data: {
          tag: t.tag,
          fullName: t.fullName,
          schoolId: school.id,
          captains: {
            create: [
              { discordUsername: t.cap1 },
              { discordUsername: t.cap2 },
            ],
          },
          staff: { create: [{ discordUsername: t.staff }] },
        },
      });
    }
    const existing = await prisma.eventTeam.findFirst({
      where: { eventId: event!.id, teamId: team.id },
    });
    if (!existing) {
      await prisma.eventTeam.create({
        data: {
          eventId: event!.id,
          teamId: team.id,
          placement: 1,
          score: 12.05,
          seed: 0,
          rankLabel: "Eternus 6",
          groupName: "Group 1",
        },
      });
    }
  }

  let pastEvent = await prisma.event.findFirst({ where: { slug: "showmatch-feb-2024" } });
  if (!pastEvent) {
    pastEvent = await prisma.event.create({
      data: {
        name: "Showmatch 1",
        slug: "showmatch-feb-2024",
        startDate: new Date("2024-02-15"),
        type: "show match",
        description:
          "Invited collegiate programs competed in our first Deadlock showmatch — a public showcase for schools, fans, and partners.",
        isCurrent: false,
      },
    });
  }

  let holidayEvent = await prisma.event.findFirst({ where: { slug: "holiday-bash" } });
  if (!holidayEvent) {
    holidayEvent = await prisma.event.create({
      data: {
        name: "Holiday Bash",
        slug: "holiday-bash",
        startDate: new Date("2024-12-20"),
        type: "tournament",
        description:
          "Seasonal Holiday Bash featuring College Deadlock teams — community-focused competition and visibility for participating schools.",
        isCurrent: false,
      },
    });
  }

  // Ensure Iowa State and Minnesota State teams for matches
  const iowaStateSchool = await prisma.school.findUnique({ where: { slug: "iowa-state" } });
  const mnsuSchool = await prisma.school.findUnique({ where: { slug: "mnsu" } });
  const purdueSchool = await prisma.school.findUnique({ where: { slug: "purdue" } });
  let isuTeam = iowaStateSchool ? await prisma.team.findFirst({ where: { schoolId: iowaStateSchool.id } }) : null;
  let mnsuTeam = mnsuSchool ? await prisma.team.findFirst({ where: { schoolId: mnsuSchool.id } }) : null;
  let purdueTeam = purdueSchool ? await prisma.team.findFirst({ where: { schoolId: purdueSchool.id } }) : null;
  if (iowaStateSchool && !isuTeam) {
    isuTeam = await prisma.team.create({
      data: {
        tag: "ISU",
        fullName: "Iowa State",
        schoolId: iowaStateSchool.id,
        captains: { create: [{ discordUsername: "captain1" }, { discordUsername: "captain2" }] },
      },
    });
  }
  if (mnsuSchool && !mnsuTeam) {
    mnsuTeam = await prisma.team.create({
      data: {
        tag: "MNSU",
        fullName: "Minnesota State Mavericks",
        schoolId: mnsuSchool.id,
        captains: { create: [{ discordUsername: "captain1" }, { discordUsername: "captain2" }] },
      },
    });
  }
  if (purdueSchool && !purdueTeam) {
    purdueTeam = await prisma.team.create({
      data: {
        tag: "Purdue.G",
        fullName: "Purdue Gaming",
        schoolId: purdueSchool.id,
        captains: { create: [{ discordUsername: "captain1" }, { discordUsername: "captain2" }] },
      },
    });
  }

  if (pastEvent && purdueTeam) {
    const existing = await prisma.eventTeam.findFirst({ where: { eventId: pastEvent.id, teamId: purdueTeam.id } });
    if (!existing) {
      await prisma.eventTeam.create({
        data: { eventId: pastEvent.id, teamId: purdueTeam.id, placement: 1, groupName: "Champion" },
      });
    }
  }
  if (holidayEvent! && isuTeam) {
    const existing = await prisma.eventTeam.findFirst({ where: { eventId: holidayEvent!.id, teamId: isuTeam!.id } });
    if (!existing) {
      await prisma.eventTeam.create({
        data: { eventId: holidayEvent!.id, teamId: isuTeam!.id, placement: 1, groupName: "Champion" },
      });
    }
  }

  const nuTeam = await prisma.team.findFirst({ where: { tag: "NU" } });
  const unlTeam = await prisma.team.findFirst({ where: { tag: "UNL" } });
  const gmuTeam = await prisma.team.findFirst({ where: { tag: "GMU" } });
  const psuTeam = await prisma.team.findFirst({ where: { tag: "PSU" } });

  if (event && nuTeam && gmuTeam && !(await prisma.match.findFirst({ where: { eventId: event.id } }))) {
    const matches = [
      { team1: gmuTeam, team2: psuTeam, at: new Date("2025-02-07T19:00:00-05:00"), label: "Week 1", s1: 2, s2: 0 },
      { team1: isuTeam, team2: mnsuTeam, at: new Date("2025-02-14T21:00:00-05:00"), label: "Week 2", s1: 2, s2: 0 },
      { team1: isuTeam, team2: unlTeam, at: new Date("2025-02-20T20:00:00-05:00"), label: "Week 3", s1: null, s2: null },
      { team1: purdueTeam, team2: psuTeam, at: new Date("2025-02-21T19:00:00-05:00"), label: "Week 3", s1: null, s2: null },
    ];
    for (const m of matches) {
      if (m.team1 && m.team2) {
        await prisma.match.create({
          data: {
            eventId: event.id,
            team1Id: m.team1.id,
            team2Id: m.team2.id,
            scheduledAt: m.at,
            label: m.label,
            score1: m.s1 ?? undefined,
            score2: m.s2 ?? undefined,
          },
        });
      }
    }
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
