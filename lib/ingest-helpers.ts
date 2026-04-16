import { prisma } from "@/lib/prisma";

function normalizeUrl(v: string | null | undefined): string | null {
  if (v == null || v === "") return null;
  return v;
}

export async function upsertSchool(slug: string, name: string) {
  return prisma.school.upsert({
    where: { slug },
    create: { name, slug },
    update: { name },
  });
}

export async function upsertTeam(
  schoolId: string,
  input: { tag: string; fullName: string; logoUrl?: string | null }
) {
  const logoUrl = normalizeUrl(input.logoUrl ?? undefined);
  const existing = await prisma.team.findFirst({
    where: { schoolId, tag: input.tag },
  });
  if (existing) {
    return prisma.team.update({
      where: { id: existing.id },
      data: {
        fullName: input.fullName,
        ...(logoUrl !== undefined ? { logoUrl } : {}),
      },
    });
  }
  return prisma.team.create({
    data: {
      schoolId,
      tag: input.tag,
      fullName: input.fullName,
      logoUrl: logoUrl ?? null,
    },
  });
}
