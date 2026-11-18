import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import {
  Difficulty,
  PrismaClient,
  Provenance,
  PublicationStatus,
} from '../src/generated/prisma/client';

type SeedProject = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  categorySlug: string;
  difficulty: Difficulty;
  difficultyProvenance: Provenance;
  estimatedCostCents: number;
  costProvenance: Provenance;
  estimatedMinutes: number;
  timeProvenance: Provenance;
  tagSlugs: string[];
  toolSlugs: string[];
  materialSlugs: Array<{ slug: string; quantity?: string; unit?: string }>;
  creatorKey: string;
  sourceKey: string;
  sourceUrl: string;
  status: PublicationStatus;
  publishedAt?: Date;
};

const categories = [
  {
    slug: 'electronics',
    name: 'Electronics',
    description: 'Circuits, microcontrollers, and maker electronics.',
    sortOrder: 10,
  },
  {
    slug: 'woodworking',
    name: 'Woodworking',
    description: 'Furniture, fixtures, and shop projects in wood.',
    sortOrder: 20,
  },
  {
    slug: '3d-printing',
    name: '3D Printing',
    description: 'Printable parts, enclosures, and print workflow projects.',
    sortOrder: 30,
  },
  {
    slug: 'cnc-machining',
    name: 'CNC Machining',
    description: 'CNC cutting, machining, and CAM-oriented builds.',
    sortOrder: 40,
  },
  {
    slug: 'robotics',
    name: 'Robotics',
    description: 'Mobile robots, actuators, and control systems.',
    sortOrder: 50,
  },
  {
    slug: 'home-improvement',
    name: 'Home Improvement',
    description: 'Practical upgrades around the house and workshop.',
    sortOrder: 60,
  },
] as const;

const tags = [
  { slug: 'beginner-friendly', name: 'Beginner Friendly' },
  { slug: 'weekend-build', name: 'Weekend Build' },
  { slug: 'workshop', name: 'Workshop' },
  { slug: 'outdoors', name: 'Outdoors' },
  { slug: 'automation', name: 'Automation' },
  { slug: 'storage', name: 'Storage' },
  { slug: 'lighting', name: 'Lighting' },
  { slug: 'demo-data', name: 'Demo Data' },
] as const;

const tools = [
  { slug: 'soldering-iron', name: 'Soldering iron' },
  { slug: 'multimeter', name: 'Multimeter' },
  { slug: 'table-saw', name: 'Table saw' },
  { slug: 'drill-press', name: 'Drill press' },
  { slug: '3d-printer', name: '3D printer' },
  { slug: 'cnc-router', name: 'CNC router' },
  { slug: 'screwdriver-set', name: 'Screwdriver set' },
  { slug: 'calipers', name: 'Digital calipers' },
] as const;

const materials = [
  { slug: 'pine-board', name: 'Pine board' },
  { slug: 'plywood-sheet', name: 'Plywood sheet' },
  { slug: 'pla-filament', name: 'PLA filament' },
  { slug: 'petg-filament', name: 'PETG filament' },
  { slug: 'arduino-uno', name: 'Arduino Uno (or compatible)' },
  { slug: 'esp32-devkit', name: 'ESP32 development board' },
  { slug: 'led-strip', name: 'LED strip' },
  { slug: 'aluminum-extrusion', name: 'Aluminum extrusion' },
  { slug: 'machine-screws', name: 'Machine screws' },
  { slug: 'wood-glue', name: 'Wood glue' },
] as const;

const creators = [
  {
    key: 'demo-atelier',
    name: 'Demo Maker Atelier (fictional)',
    websiteUrl: 'https://example.com/demo-maker-atelier',
  },
  {
    key: 'north-bench',
    name: 'North Bench Labs (fictional)',
    websiteUrl: 'https://example.com/north-bench-labs',
  },
  {
    key: 'signal-shed',
    name: 'Signal Shed Workshop (fictional)',
    websiteUrl: null,
  },
] as const;

const sources = [
  {
    key: 'demo-guide-site',
    name: 'Tinker Index Demo Guides (fictional)',
    websiteUrl: 'https://example.com/tinker-index-demo-guides',
  },
  {
    key: 'workshop-notes',
    name: 'Workshop Notes Archive (fictional)',
    websiteUrl: 'https://example.com/workshop-notes-archive',
  },
] as const;

const publishedAt = (day: number) => new Date(`2026-10-${String(day).padStart(2, '0')}T12:00:00.000Z`);

const projects: SeedProject[] = [
  {
    slug: 'demo-bench-power-strip-mount',
    title: 'Demo: Under-Bench Power Strip Mount',
    summary: 'A fictional weekend woodworking fixture that keeps a power strip off the floor.',
    description:
      'Demonstration analysis only. Describes a simple pine bracket concept for mounting a power strip under a workbench edge. Not real instructions and not affiliated with any commercial product.',
    categorySlug: 'woodworking',
    difficulty: Difficulty.BEGINNER,
    difficultyProvenance: Provenance.SOURCE_VERIFIED,
    estimatedCostCents: 1800,
    costProvenance: Provenance.AI_ESTIMATED,
    estimatedMinutes: 90,
    timeProvenance: Provenance.AI_ESTIMATED,
    tagSlugs: ['beginner-friendly', 'weekend-build', 'workshop', 'demo-data'],
    toolSlugs: ['table-saw', 'drill-press', 'screwdriver-set'],
    materialSlugs: [
      { slug: 'pine-board', quantity: '1', unit: 'board' },
      { slug: 'wood-glue', quantity: '1', unit: 'bottle' },
      { slug: 'machine-screws', quantity: '8', unit: 'pcs' },
    ],
    creatorKey: 'demo-atelier',
    sourceKey: 'demo-guide-site',
    sourceUrl: 'https://example.com/tinker-index-demo-guides/bench-power-strip-mount',
    status: PublicationStatus.PUBLISHED,
    publishedAt: publishedAt(2),
  },
  {
    slug: 'demo-led-shelf-lighting',
    title: 'Demo: Low-Profile LED Shelf Lighting',
    summary: 'A fictional electronics starter project for under-shelf accent lighting.',
    description:
      'Demonstration analysis only. Covers power budgeting for a short LED strip and a clean cable path. Contains original sample commentary, not copied instructions.',
    categorySlug: 'electronics',
    difficulty: Difficulty.BEGINNER,
    difficultyProvenance: Provenance.SOURCE_VERIFIED,
    estimatedCostCents: 2500,
    costProvenance: Provenance.SOURCE_VERIFIED,
    estimatedMinutes: 120,
    timeProvenance: Provenance.AI_ESTIMATED,
    tagSlugs: ['beginner-friendly', 'lighting', 'demo-data'],
    toolSlugs: ['soldering-iron', 'multimeter', 'screwdriver-set'],
    materialSlugs: [
      { slug: 'led-strip', quantity: '1', unit: 'm' },
      { slug: 'machine-screws', quantity: '4', unit: 'pcs' },
    ],
    creatorKey: 'signal-shed',
    sourceKey: 'workshop-notes',
    sourceUrl: 'https://example.com/workshop-notes-archive/led-shelf-lighting',
    status: PublicationStatus.PUBLISHED,
    publishedAt: publishedAt(3),
  },
  {
    slug: 'demo-tool-wall-pegboard-frame',
    title: 'Demo: Modular Tool Wall Frame',
    summary: 'A fictional framed plywood panel for organizing hand tools.',
    description:
      'Demonstration analysis only. Explains layout planning and mounting considerations for a small pegboard frame. Example content for catalog testing.',
    categorySlug: 'home-improvement',
    difficulty: Difficulty.INTERMEDIATE,
    difficultyProvenance: Provenance.AI_ESTIMATED,
    estimatedCostCents: 4200,
    costProvenance: Provenance.AI_ESTIMATED,
    estimatedMinutes: 240,
    timeProvenance: Provenance.AI_ESTIMATED,
    tagSlugs: ['workshop', 'storage', 'demo-data'],
    toolSlugs: ['table-saw', 'drill-press'],
    materialSlugs: [
      { slug: 'plywood-sheet', quantity: '1', unit: 'sheet' },
      { slug: 'pine-board', quantity: '2', unit: 'boards' },
      { slug: 'wood-glue', quantity: '1', unit: 'bottle' },
    ],
    creatorKey: 'north-bench',
    sourceKey: 'demo-guide-site',
    sourceUrl: 'https://example.com/tinker-index-demo-guides/tool-wall-frame',
    status: PublicationStatus.PUBLISHED,
    publishedAt: publishedAt(4),
  },
  {
    slug: 'demo-esp32-shop-thermometer',
    title: 'Demo: ESP32 Shop Thermometer Display',
    summary: 'A fictional microcontroller enclosure project for workshop climate monitoring.',
    description:
      'Demonstration analysis only. Discusses sensor placement and a printable enclosure concept. No real firmware or vendor branding is included.',
    categorySlug: 'electronics',
    difficulty: Difficulty.INTERMEDIATE,
    difficultyProvenance: Provenance.SOURCE_VERIFIED,
    estimatedCostCents: 3500,
    costProvenance: Provenance.SOURCE_VERIFIED,
    estimatedMinutes: 300,
    timeProvenance: Provenance.AI_ESTIMATED,
    tagSlugs: ['automation', 'workshop', 'demo-data'],
    toolSlugs: ['soldering-iron', '3d-printer', 'calipers', 'multimeter'],
    materialSlugs: [
      { slug: 'esp32-devkit', quantity: '1', unit: 'board' },
      { slug: 'pla-filament', quantity: '100', unit: 'g' },
    ],
    creatorKey: 'signal-shed',
    sourceKey: 'workshop-notes',
    sourceUrl: 'https://example.com/workshop-notes-archive/esp32-shop-thermometer',
    status: PublicationStatus.PUBLISHED,
    publishedAt: publishedAt(5),
  },
  {
    slug: 'demo-print-in-place-hinge-box',
    title: 'Demo: Print-in-Place Hinge Parts Box',
    summary: 'A fictional 3D-printed organizer with living hinges for small fasteners.',
    description:
      'Demonstration analysis only. Focuses on clearances, layer orientation, and post-print cleanup. Sample catalog record for 3D printing filters.',
    categorySlug: '3d-printing',
    difficulty: Difficulty.BEGINNER,
    difficultyProvenance: Provenance.SOURCE_VERIFIED,
    estimatedCostCents: 600,
    costProvenance: Provenance.AI_ESTIMATED,
    estimatedMinutes: 180,
    timeProvenance: Provenance.SOURCE_VERIFIED,
    tagSlugs: ['beginner-friendly', 'storage', 'demo-data'],
    toolSlugs: ['3d-printer', 'calipers'],
    materialSlugs: [{ slug: 'pla-filament', quantity: '80', unit: 'g' }],
    creatorKey: 'demo-atelier',
    sourceKey: 'demo-guide-site',
    sourceUrl: 'https://example.com/tinker-index-demo-guides/print-in-place-hinge-box',
    status: PublicationStatus.PUBLISHED,
    publishedAt: publishedAt(6),
  },
  {
    slug: 'demo-petg-camera-mount',
    title: 'Demo: PETG Tripod Phone Mount',
    summary: 'A fictional durable mount designed for outdoor use with PETG.',
    description:
      'Demonstration analysis only. Highlights material choice trade-offs between PLA and PETG for outdoor fixtures. Fictional attribution only.',
    categorySlug: '3d-printing',
    difficulty: Difficulty.INTERMEDIATE,
    difficultyProvenance: Provenance.AI_ESTIMATED,
    estimatedCostCents: 900,
    costProvenance: Provenance.AI_ESTIMATED,
    estimatedMinutes: 210,
    timeProvenance: Provenance.AI_ESTIMATED,
    tagSlugs: ['outdoors', 'weekend-build', 'demo-data'],
    toolSlugs: ['3d-printer', 'calipers', 'screwdriver-set'],
    materialSlugs: [
      { slug: 'petg-filament', quantity: '120', unit: 'g' },
      { slug: 'machine-screws', quantity: '4', unit: 'pcs' },
    ],
    creatorKey: 'north-bench',
    sourceKey: 'workshop-notes',
    sourceUrl: 'https://example.com/workshop-notes-archive/petg-camera-mount',
    status: PublicationStatus.PUBLISHED,
    publishedAt: publishedAt(7),
  },
  {
    slug: 'demo-cnc-cutting-board-template',
    title: 'Demo: CNC Cutting Board Template',
    summary: 'A fictional CNC practice project for fixture setup and toolpaths.',
    description:
      'Demonstration analysis only. Describes workholding considerations and a simple contour workflow. Not a food-safety guide and not a real product design.',
    categorySlug: 'cnc-machining',
    difficulty: Difficulty.INTERMEDIATE,
    difficultyProvenance: Provenance.SOURCE_VERIFIED,
    estimatedCostCents: 2800,
    costProvenance: Provenance.SOURCE_VERIFIED,
    estimatedMinutes: 360,
    timeProvenance: Provenance.AI_ESTIMATED,
    tagSlugs: ['workshop', 'weekend-build', 'demo-data'],
    toolSlugs: ['cnc-router', 'calipers'],
    materialSlugs: [{ slug: 'pine-board', quantity: '1', unit: 'blank' }],
    creatorKey: 'demo-atelier',
    sourceKey: 'demo-guide-site',
    sourceUrl: 'https://example.com/tinker-index-demo-guides/cnc-cutting-board-template',
    status: PublicationStatus.PUBLISHED,
    publishedAt: publishedAt(8),
  },
  {
    slug: 'demo-aluminum-gantry-bracket',
    title: 'Demo: Aluminum Extrusion Gantry Bracket',
    summary: 'A fictional CNC plate for joining 2020 extrusion in a small gantry.',
    description:
      'Demonstration analysis only. Discusses hole patterning and plate stiffness at a high level. Intended solely as searchable demo catalog content.',
    categorySlug: 'cnc-machining',
    difficulty: Difficulty.ADVANCED,
    difficultyProvenance: Provenance.AI_ESTIMATED,
    estimatedCostCents: 5500,
    costProvenance: Provenance.AI_ESTIMATED,
    estimatedMinutes: 480,
    timeProvenance: Provenance.AI_ESTIMATED,
    tagSlugs: ['workshop', 'automation', 'demo-data'],
    toolSlugs: ['cnc-router', 'calipers', 'drill-press'],
    materialSlugs: [
      { slug: 'aluminum-extrusion', quantity: '1', unit: 'm' },
      { slug: 'machine-screws', quantity: '12', unit: 'pcs' },
    ],
    creatorKey: 'north-bench',
    sourceKey: 'workshop-notes',
    sourceUrl: 'https://example.com/workshop-notes-archive/aluminum-gantry-bracket',
    status: PublicationStatus.PUBLISHED,
    publishedAt: publishedAt(9),
  },
  {
    slug: 'demo-line-following-robot-chassis',
    title: 'Demo: Line-Following Robot Chassis',
    summary: 'A fictional beginner robotics chassis using printable mounts and an Uno board.',
    description:
      'Demonstration analysis only. Outlines chassis stiffness and sensor mounting concepts. Does not include proprietary robot designs or real competition rules.',
    categorySlug: 'robotics',
    difficulty: Difficulty.INTERMEDIATE,
    difficultyProvenance: Provenance.SOURCE_VERIFIED,
    estimatedCostCents: 6500,
    costProvenance: Provenance.SOURCE_VERIFIED,
    estimatedMinutes: 600,
    timeProvenance: Provenance.AI_ESTIMATED,
    tagSlugs: ['automation', 'beginner-friendly', 'demo-data'],
    toolSlugs: ['3d-printer', 'soldering-iron', 'screwdriver-set', 'multimeter'],
    materialSlugs: [
      { slug: 'arduino-uno', quantity: '1', unit: 'board' },
      { slug: 'pla-filament', quantity: '200', unit: 'g' },
      { slug: 'machine-screws', quantity: '20', unit: 'pcs' },
    ],
    creatorKey: 'signal-shed',
    sourceKey: 'demo-guide-site',
    sourceUrl: 'https://example.com/tinker-index-demo-guides/line-following-robot-chassis',
    status: PublicationStatus.PUBLISHED,
    publishedAt: publishedAt(10),
  },
  {
    slug: 'demo-servo-pan-tilt-rig',
    title: 'Demo: Dual-Servo Pan-Tilt Rig',
    summary: 'A fictional compact pan-tilt assembly for sensors or cameras.',
    description:
      'Demonstration analysis only. Reviews torque margins and printable horn adapters. Example robotics catalog entry with clear demo labeling.',
    categorySlug: 'robotics',
    difficulty: Difficulty.ADVANCED,
    difficultyProvenance: Provenance.AI_ESTIMATED,
    estimatedCostCents: 4800,
    costProvenance: Provenance.AI_ESTIMATED,
    estimatedMinutes: 420,
    timeProvenance: Provenance.AI_ESTIMATED,
    tagSlugs: ['automation', 'outdoors', 'demo-data'],
    toolSlugs: ['3d-printer', 'calipers', 'screwdriver-set'],
    materialSlugs: [
      { slug: 'petg-filament', quantity: '150', unit: 'g' },
      { slug: 'machine-screws', quantity: '10', unit: 'pcs' },
    ],
    creatorKey: 'demo-atelier',
    sourceKey: 'workshop-notes',
    sourceUrl: 'https://example.com/workshop-notes-archive/servo-pan-tilt-rig',
    status: PublicationStatus.PUBLISHED,
    publishedAt: publishedAt(11),
  },
  {
    slug: 'demo-mudroom-boot-rack',
    title: 'Demo: Compact Mudroom Boot Rack',
    summary: 'A fictional home-improvement storage build for a small entryway.',
    description:
      'Demonstration analysis only. Covers footprint planning and finish durability at a conceptual level. Fictional creator and source links only.',
    categorySlug: 'home-improvement',
    difficulty: Difficulty.BEGINNER,
    difficultyProvenance: Provenance.SOURCE_VERIFIED,
    estimatedCostCents: 3200,
    costProvenance: Provenance.SOURCE_VERIFIED,
    estimatedMinutes: 200,
    timeProvenance: Provenance.SOURCE_VERIFIED,
    tagSlugs: ['storage', 'weekend-build', 'demo-data'],
    toolSlugs: ['table-saw', 'drill-press', 'screwdriver-set'],
    materialSlugs: [
      { slug: 'pine-board', quantity: '3', unit: 'boards' },
      { slug: 'wood-glue', quantity: '1', unit: 'bottle' },
    ],
    creatorKey: 'north-bench',
    sourceKey: 'demo-guide-site',
    sourceUrl: 'https://example.com/tinker-index-demo-guides/mudroom-boot-rack',
    status: PublicationStatus.PUBLISHED,
    publishedAt: publishedAt(12),
  },
  {
    slug: 'demo-garage-ceiling-storage',
    title: 'Demo: Garage Ceiling Storage Rails',
    summary: 'A fictional overhead lumber storage concept for a one-car garage.',
    description:
      'Demonstration analysis only. Emphasizes load distribution and fastener choice without providing structural engineering claims. Demo catalog content.',
    categorySlug: 'home-improvement',
    difficulty: Difficulty.ADVANCED,
    difficultyProvenance: Provenance.AI_ESTIMATED,
    estimatedCostCents: 8900,
    costProvenance: Provenance.AI_ESTIMATED,
    estimatedMinutes: 720,
    timeProvenance: Provenance.AI_ESTIMATED,
    tagSlugs: ['storage', 'workshop', 'demo-data'],
    toolSlugs: ['drill-press', 'screwdriver-set', 'table-saw'],
    materialSlugs: [
      { slug: 'pine-board', quantity: '6', unit: 'boards' },
      { slug: 'machine-screws', quantity: '24', unit: 'pcs' },
    ],
    creatorKey: 'signal-shed',
    sourceKey: 'workshop-notes',
    sourceUrl: 'https://example.com/workshop-notes-archive/garage-ceiling-storage',
    status: PublicationStatus.PUBLISHED,
    publishedAt: publishedAt(13),
  },
  {
    slug: 'demo-draft-router-table-fence',
    title: 'Demo Draft: Router Table Fence Concept',
    summary: 'An unpublished draft used to verify public endpoints hide non-published records.',
    description:
      'Demonstration draft only. Must never appear in public catalog responses while status remains DRAFT.',
    categorySlug: 'woodworking',
    difficulty: Difficulty.EXPERT,
    difficultyProvenance: Provenance.UNKNOWN,
    estimatedCostCents: 12000,
    costProvenance: Provenance.UNKNOWN,
    estimatedMinutes: 900,
    timeProvenance: Provenance.UNKNOWN,
    tagSlugs: ['workshop', 'demo-data'],
    toolSlugs: ['table-saw', 'drill-press', 'calipers'],
    materialSlugs: [
      { slug: 'plywood-sheet', quantity: '1', unit: 'sheet' },
      { slug: 'aluminum-extrusion', quantity: '1', unit: 'm' },
    ],
    creatorKey: 'demo-atelier',
    sourceKey: 'demo-guide-site',
    sourceUrl: 'https://example.com/tinker-index-demo-guides/draft-router-table-fence',
    status: PublicationStatus.DRAFT,
  },
  {
    slug: 'demo-desk-cable-tray',
    title: 'Demo: Under-Desk Cable Tray',
    summary: 'A fictional quick-win organization project for a standing desk.',
    description:
      'Demonstration analysis only. Suggests tray depth and mounting spacing for cable management. Completely fictional sample attribution.',
    categorySlug: 'woodworking',
    difficulty: Difficulty.BEGINNER,
    difficultyProvenance: Provenance.SOURCE_VERIFIED,
    estimatedCostCents: 1500,
    costProvenance: Provenance.SOURCE_VERIFIED,
    estimatedMinutes: 75,
    timeProvenance: Provenance.SOURCE_VERIFIED,
    tagSlugs: ['beginner-friendly', 'weekend-build', 'storage', 'demo-data'],
    toolSlugs: ['drill-press', 'screwdriver-set'],
    materialSlugs: [
      { slug: 'plywood-sheet', quantity: '0.25', unit: 'sheet' },
      { slug: 'machine-screws', quantity: '6', unit: 'pcs' },
    ],
    creatorKey: 'north-bench',
    sourceKey: 'demo-guide-site',
    sourceUrl: 'https://example.com/tinker-index-demo-guides/desk-cable-tray',
    status: PublicationStatus.PUBLISHED,
    publishedAt: publishedAt(14),
  },
  {
    slug: 'demo-solar-usb-charger-pouch',
    title: 'Demo: Portable USB Charger Pouch Frame',
    summary: 'A fictional lightweight frame concept for a small solar USB charger pouch.',
    description:
      'Demonstration analysis only. Explores outdoor durability and printable clips. Example electronics/outdoors catalog crossover record.',
    categorySlug: 'electronics',
    difficulty: Difficulty.EXPERT,
    difficultyProvenance: Provenance.AI_ESTIMATED,
    estimatedCostCents: 7600,
    costProvenance: Provenance.AI_ESTIMATED,
    estimatedMinutes: 540,
    timeProvenance: Provenance.AI_ESTIMATED,
    tagSlugs: ['outdoors', 'automation', 'demo-data'],
    toolSlugs: ['3d-printer', 'soldering-iron', 'multimeter', 'calipers'],
    materialSlugs: [
      { slug: 'petg-filament', quantity: '90', unit: 'g' },
      { slug: 'esp32-devkit', quantity: '1', unit: 'board' },
    ],
    creatorKey: 'signal-shed',
    sourceKey: 'workshop-notes',
    sourceUrl: 'https://example.com/workshop-notes-archive/solar-usb-charger-pouch',
    status: PublicationStatus.PUBLISHED,
    publishedAt: publishedAt(15),
  },
];

function buildSearchText(input: {
  title: string;
  summary: string;
  description: string;
  categoryName: string;
  tagNames: string[];
  toolNames: string[];
  materialNames: string[];
}): string {
  return [
    input.title,
    input.summary,
    input.description,
    input.categoryName,
    ...input.tagNames,
    ...input.toolNames,
    ...input.materialNames,
    'demo data',
  ].join(' ');
}

async function upsertBasics(prisma: PrismaClient) {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      create: category,
      update: {
        name: category.name,
        description: category.description,
        sortOrder: category.sortOrder,
      },
    });
  }

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      create: tag,
      update: { name: tag.name },
    });
  }

  for (const tool of tools) {
    await prisma.tool.upsert({
      where: { slug: tool.slug },
      create: tool,
      update: { name: tool.name },
    });
  }

  for (const material of materials) {
    await prisma.material.upsert({
      where: { slug: material.slug },
      create: material,
      update: { name: material.name },
    });
  }

  const creatorIds = new Map<string, string>();
  for (const creator of creators) {
    const existing = await prisma.creator.findFirst({ where: { name: creator.name } });
    const row =
      existing ??
      (await prisma.creator.create({
        data: { name: creator.name, websiteUrl: creator.websiteUrl },
      }));
    if (existing) {
      await prisma.creator.update({
        where: { id: existing.id },
        data: { websiteUrl: creator.websiteUrl },
      });
    }
    creatorIds.set(creator.key, row.id);
  }

  const sourceIds = new Map<string, string>();
  for (const source of sources) {
    const existing = await prisma.source.findFirst({ where: { name: source.name } });
    const row =
      existing ??
      (await prisma.source.create({
        data: { name: source.name, websiteUrl: source.websiteUrl },
      }));
    if (existing) {
      await prisma.source.update({
        where: { id: existing.id },
        data: { websiteUrl: source.websiteUrl },
      });
    }
    sourceIds.set(source.key, row.id);
  }

  return { creatorIds, sourceIds };
}

async function seed() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required to seed the database');
  }

  const pool = new Pool({ connectionString: databaseUrl, connectionTimeoutMillis: 5_000 });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    const { creatorIds, sourceIds } = await upsertBasics(prisma);

    for (const project of projects) {
      const category = await prisma.category.findUniqueOrThrow({
        where: { slug: project.categorySlug },
      });
      const tagRows = await prisma.tag.findMany({
        where: { slug: { in: project.tagSlugs } },
      });
      const toolRows = await prisma.tool.findMany({
        where: { slug: { in: project.toolSlugs } },
      });
      const materialRows = await prisma.material.findMany({
        where: { slug: { in: project.materialSlugs.map((item) => item.slug) } },
      });

      const searchText = buildSearchText({
        title: project.title,
        summary: project.summary,
        description: project.description,
        categoryName: category.name,
        tagNames: tagRows.map((tag) => tag.name),
        toolNames: toolRows.map((tool) => tool.name),
        materialNames: materialRows.map((material) => material.name),
      });

      const data = {
        title: project.title,
        summary: project.summary,
        description: project.description,
        status: project.status,
        difficulty: project.difficulty,
        difficultyProvenance: project.difficultyProvenance,
        estimatedCostCents: project.estimatedCostCents,
        currency: 'USD',
        costProvenance: project.costProvenance,
        estimatedMinutes: project.estimatedMinutes,
        timeProvenance: project.timeProvenance,
        categoryId: category.id,
        creatorId: creatorIds.get(project.creatorKey)!,
        sourceId: sourceIds.get(project.sourceKey)!,
        sourceUrl: project.sourceUrl,
        searchText,
        isDemo: true,
        publishedAt: project.publishedAt ?? null,
        mainImageUrl: null,
        mainImageAttribution: 'Demo placeholder — no third-party image reused',
        mainImageLicense: 'N/A',
        mainImageRightsHolder: 'Tinker Index demo seed',
      };

      const saved = await prisma.project.upsert({
        where: { slug: project.slug },
        create: {
          slug: project.slug,
          ...data,
        },
        update: data,
      });

      await prisma.projectTag.deleteMany({ where: { projectId: saved.id } });
      await prisma.projectTool.deleteMany({ where: { projectId: saved.id } });
      await prisma.projectMaterial.deleteMany({ where: { projectId: saved.id } });

      await prisma.projectTag.createMany({
        data: tagRows.map((tag) => ({ projectId: saved.id, tagId: tag.id })),
      });
      await prisma.projectTool.createMany({
        data: toolRows.map((tool) => ({ projectId: saved.id, toolId: tool.id })),
      });
      await prisma.projectMaterial.createMany({
        data: project.materialSlugs.map((item) => {
          const material = materialRows.find((row) => row.slug === item.slug)!;
          return {
            projectId: saved.id,
            materialId: material.id,
            quantity: item.quantity ?? null,
            unit: item.unit ?? null,
          };
        }),
      });
    }

    await prisma.schemaMeta.upsert({
      where: { key: 'seed.catalog.version' },
      create: { key: 'seed.catalog.version', value: 'm2b-v1' },
      update: { value: 'm2b-v1' },
    });

    const publishedCount = await prisma.project.count({
      where: { status: PublicationStatus.PUBLISHED, isDemo: true },
    });
    console.log(`Seed complete. Demo published projects: ${publishedCount}`);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

void seed();
