import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const day = (n: number, hour = 17) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(hour, 0, 0, 0);
  return d;
};

async function main() {
  await prisma.registration.deleteMany();
  await prisma.event.deleteMany();
  await prisma.event.createMany({
    data: [
      { name: "Intro to Git & GitHub", category: "Workshop", date: day(3), venue: "Lab 2", description: "Branching, pull requests and your first open-source contribution.", capacity: 60, featured: true },
      { name: "24h Build Sprint", category: "Hackathon", date: day(10, 10), venue: "Main Auditorium", description: "Team up and ship a working project in a day.", capacity: 120 },
      { name: "Alumni Talk: Life at a Startup", category: "Talk", date: day(6, 15), venue: "Seminar Hall", description: "Alumni share what working in tech is really like.", capacity: 200 },
      { name: "Game Night", category: "Social", date: day(14, 18), venue: "Club Room", description: "Board games, pizza, no laptops.", capacity: 40 },
    ],
  });
}

main().finally(() => prisma.$disconnect());