"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new pg_1.Pool({ connectionString });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // Seed Categories
        // Seed Categories (Telugu)
        const categories = [
            { name: 'రాజకీయం', slug: 'politics' },
            { name: 'క్రీడలు', slug: 'sports' },
            { name: 'సినిమా', slug: 'entertainment' },
            { name: 'టెక్నాలజీ', slug: 'technology' },
            { name: 'వ్యాపారం', slug: 'business' },
            { name: 'వైరల్', slug: 'viral' }
        ];
        for (const cat of categories) {
            yield prisma.category.upsert({
                where: { slug: cat.slug },
                update: { name: cat.name },
                create: {
                    name: cat.name,
                    slug: cat.slug,
                },
            });
        }
        // Seed Tags (Telugu)
        const tags = [
            { name: 'ఎన్నికలు', slug: 'elections' },
            { name: 'ఐపీఎల్', slug: 'ipl' },
            { name: 'సినిమాలు', slug: 'movies' },
            { name: 'గ్యాడ్జెట్స్', slug: 'gadgets' },
            { name: 'స్టాక్ మార్కెట్', slug: 'stock-market' },
            { name: 'ట్రెండింగ్', slug: 'trending' }
        ];
        for (const tag of tags) {
            yield prisma.tag.upsert({
                where: { slug: tag.slug },
                update: { name: tag.name },
                create: {
                    name: tag.name,
                    slug: tag.slug,
                },
            });
        }
        // Seed Admin User
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@apnews.in';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
        const hashedPassword = yield bcryptjs_1.default.hash(adminPassword, 10);
        const admin = yield prisma.user.upsert({
            where: { email: adminEmail },
            update: {},
            create: {
                email: adminEmail,
                name: 'Admin',
                password: hashedPassword,
                role: client_1.Role.ADMIN,
                bio: 'Senior Editor at APNews.in',
                image: 'https://ui-avatars.com/api/?name=Admin&background=random',
            },
        });
        // Create Mock Articles if none exist
        // Create Mock Articles
        const allCategories = yield prisma.category.findMany();
        const allTags = yield prisma.tag.findMany();
        const loremIpsum = `
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    <h3>Key Highlights</h3>
    <ul>
      <li>Important point one regarding this news story.</li>
      <li>Second critical update that affects the region.</li>
      <li>Expert analysis and future implications.</li>
    </ul>
    <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.</p>
  `;
        for (const category of allCategories) {
            // Defined Articles per Category (Telugu)
            const categoryArticles = {
                'politics': [
                    {
                        title: 'ఏపీలో కొత్త పారిశ్రామిక విధానం: పెట్టుబడుల వెల్లువ?',
                        content: '<p><strong>అమరావతి:</strong> రాష్ట్ర ప్రభుత్వం నూతన పారిశ్రామిక విధానాన్ని ప్రకటించింది. దీనివల్ల వేల కోట్ల రూపాయల పెట్టుబడులు వచ్చే అవకాశం ఉందని మంత్రి తెలిపారు. యువతకు ఉపాధి అవకాశాలు మెరుగుపడనున్నాయి.</p><p>ముఖ్యమంత్రి మాట్లాడుతూ, "ఇది రాష్ట్ర అభివృద్ధిలో ఒక మైలురాయి," అని అన్నారు.</p>'
                    },
                    {
                        title: 'ఎన్నికల సంఘం కీలక ప్రకటన: ఓటరు జాబితా సవరణ',
                        content: '<p>కేంద్ర ఎన్నికల సంఘం వచ్చే నెల నుంచి ఓటరు జాబితా సవరణ కార్యక్రమాన్ని చేపట్టనుంది. కొత్త ఓటర్ల నమోదుకు ప్రత్యేక శిబిరాలు నిర్వహించనున్నారు.</p><p>అర్హులైన ప్రతి ఒక్కరూ ఓటు హక్కు నమోదు చేసుకోవాలని సూచించారు.</p>'
                    },
                    {
                        title: 'పార్లమెంట్ సమావేశాల్లో వాడీవేడి చర్చలు',
                        content: '<p>బడ్జెట్ సమావేశాలు ఈరోజు ప్రారంభమయ్యాయి. ప్రతిపక్షాలు వివిధ అంశాలపై ప్రభుత్వాన్ని నిలదీశాయి. ముఖ్యంగా ధరల పెరుగుదలపై చర్చ జరిగింది.</p>'
                    },
                    {
                        title: 'గ్రామీణాభివృద్ధికి ప్రత్యేక నిధులు కేటాయింపు',
                        content: '<p>కేంద్ర ప్రభుత్వం గ్రామీణ ప్రాంతాల అభివృద్ధి కోసం ప్రత్యేక ప్యాకేజీని ప్రకటించింది. రోడ్లు, నీటి వసతి తదితర మౌలిక సదుపాయాలకు ప్రాధాన్యత ఇవ్వనున్నారు.</p>'
                    },
                    {
                        title: 'రాజధాని ప్రాంతంలో హైటెక్ సిటీ విస్తరణ',
                        content: '<p>రాజధాని పరిధిలో ఐటీ రంగాన్ని మరింత విస్తరించేందుకు ప్రణాళికలు సిద్ధమయ్యాయి. పలు అంతర్జాతీయ సంస్థలు తమ కార్యాలయాలను ఏర్పాటు చేసేందుకు ఆసక్తి చూపిస్తున్నాయి.</p>'
                    }
                ],
                'sports': [
                    {
                        title: 'భారత్ vs ఆస్ట్రేలియా: ఉత్కంఠ పోరులో భారత్ విజయం',
                        content: '<p>నిన్న జరిగిన మ్యాచ్‌లో భారత జట్టు అద్భుత విజయాన్ని నమోదు చేసింది. చివరి ఓవర్‌లో బౌలర్లు కట్టడి చేయడంతో ఆస్ట్రేలియా ఓటమి పాలైంది.</p><p>ప్లేయర్ ఆఫ్ ది మ్యాచ్‌గా కెప్టెన్ ఎంపికయ్యారు.</p>'
                    },
                    {
                        title: 'ఐపీఎల్ వేలం: రికార్డు ధర పలికిన యువ ఆటగాడు',
                        content: '<p>ఈ ఏడాది ఐపీఎల్ వేలంలో తెలుగు రాష్ట్రానికి చెందిన యువ ఆటగాడు రికార్డు ధరకు అమ్ముడయ్యాడు. ఫ్రాంచైజీలు అతని కోసం పోటీ పడ్డాయి.</p>'
                    },
                    {
                        title: 'ఒలంపిక్స్ సన్నాహాల్లో భారత అథ్లెట్లు',
                        content: '<p>వచ్చే ఒలంపిక్స్ కోసం భారత క్రీడాకారులు ముమ్మర సాధన చేస్తున్నారు. పతకాల పట్టికలో భారత్ స్థానాన్ని మెరుగుపరచడమే లక్ష్యంగా పెట్టుకున్నారు.</p>'
                    },
                    {
                        title: 'అంతర్జాతీయ చెస్ టోర్నమెంట్ విజేతగా ప్రజ్ఞానంద',
                        content: '<p>యువ గ్రాండ్‌మాస్టర్ ప్రజ్ఞానంద మరో అంతర్జాతీయ టైటిల్‌ను సొంతం చేసుకున్నారు. ఫైనల్లో ప్రపంచ ఛాంపియన్‌ను ఓడించి సంచలనం సృష్టించారు.</p>'
                    },
                    {
                        title: 'ప్రో కబడ్డీ లీగ్: తెలుగు టైటాన్స్ శుభారంభం',
                        content: '<p>హైదరాబాద్ వేదికగా జరిగిన తొలి మ్యాచ్‌లో తెలుగు టైటాన్స్ ఘన విజయం సాధించింది. రైడర్లు అద్భుత ప్రదర్శన చేశారు.</p>'
                    }
                ],
                'entertainment': [
                    {
                        title: 'సంక్రాంతి బరిలో స్టార్ హీరోల సినిమాలు',
                        content: '<p>ఈ సంక్రాంతికి బాక్సాఫీస్ వద్ద గట్టి పోటీ నెలకొంది. అగ్ర హీరోల సినిమాలు ఒకేసారి విడుదలవుతుండటంతో అభిమానుల్లో ఉత్కంఠ నెలకొంది.</p>'
                    },
                    {
                        title: 'ఆస్కార్ రేసులో తెలుగు సినిమా?',
                        content: '<p>తాజాగా విడుదలైన ఓ తెలుగు సినిమా ఆస్కార్ బరిలో నిలిచే అవకాశం ఉందని విశ్లేషకులు అంటున్నారు. అంతర్జాతీయ చలన చిత్రోత్సవాల్లో ప్రదర్శితమై ప్రశంసలు పొందింది.</p>'
                    },
                    {
                        title: 'ఓటీటీలో రికార్డులు సృష్టిస్తున్న వెబ్ సిరీస్',
                        content: '<p>ఇటీవల విడుదలైన క్రైమ్ థ్రిల్లర్ వెబ్ సిరీస్ ఓటీటీలో వ్యూస్ పరంగా రికార్డులు బద్దలు కొడుతోంది. కథ, కథనం ప్రేక్షకులను ఆకట్టుకుంటున్నాయి.</p>'
                    },
                    {
                        title: 'కొత్త సినిమా షూటింగ్ ప్రారంభించిన యువ హీరో',
                        content: '<p>వరుస విజయాలతో దూసుకుపోతున్న యువ హీరో తన తదుపరి చిత్రాన్ని ప్రారంభించారు. ప్రముఖ దర్శకుడు ఈ సినిమాను తెరకెక్కిస్తున్నారు.</p>'
                    },
                    {
                        title: 'రాష్ట్ర నంది అవార్డుల ప్రకటన',
                        content: '<p>షార్ట్ ఫిలింస్ మరియు డాక్యుమెంటరీలకు ఈ ఏడాది నంది అవార్డులను ప్రభుత్వం ప్రకటించింది. ఉత్తమ చిత్రంగా సామాజిక సందేశాత్మక చిత్రం ఎంపికైంది.</p>'
                    }
                ],
                'technology': [
                    {
                        title: 'ఆర్టిఫిషియల్ ఇంటలిజెన్స్: భవిష్యత్తు ఎలా ఉండబోతోంది?',
                        content: '<p>ఏఐ టెక్నాలజీ వేగంగా అభివృద్ధి చెందుతోంది. రాబోయే రోజుల్లో ఇది అన్ని రంగాలను ప్రభావితం చేయనుందని నిపుణులు అంచనా వేస్తున్నారు.</p>'
                    },
                    {
                        title: 'బడ్జెట్ ధరలో కొత్త 5జీ స్మార్ట్‌ఫోన్ విడుదల',
                        content: '<p>ప్రముఖ మొబైల్ కంపెనీ బడ్జెట్ ధరలో అత్యాధునిక ఫీచర్లతో కూడిన 5జీ ఫోన్‌ను మార్కెట్లోకి విడుదల చేసింది.</p>'
                    },
                    {
                        title: 'ఇస్రో మరో ఘన విజయం: ఉపగ్రహ ప్రయోగం విజయవంతం',
                        content: '<p>శ్రీహరికోట నుంచి ఇస్రో ప్రయోగించిన రాకెట్ నిర్ణీత కక్ష్యలోకి ఉపగ్రహాన్ని విజయవంతంగా ప్రవేశపెట్టింది. శాస్త్రవేత్తలను ప్రధాని అభినందించారు.</p>'
                    },
                    {
                        title: 'వాట్సాప్‌లో కొత్త ఫీచర్: ఇకపై ఆ పని చేయడం చాలా సులభం',
                        content: '<p>వాట్సాప్ తన వినియోగదారుల కోసం మరో కొత్త ఫీచర్‌ను అందుబాటులోకి తెచ్చింది. దీని ద్వారా ప్రైవసీ మరింత మెరుగుపడుతుందని సంస్థ తెలిపింది.</p>'
                    },
                    {
                        title: 'ఎలక్ట్రిక్ కార్ల వైపు మొగ్గు చూపుతున్న వినియోగదారులు',
                        content: '<p>పెట్రోల్ ధరల పెరుగుదల మరియు పర్యావరణ స్పృహ కారణంగా ఎలక్ట్రిక్ వాహనాల అమ్మకాలు భారీగా పెరిగాయి.</p>'
                    }
                ],
                'business': [
                    {
                        title: 'స్టాక్ మార్కెట్ ఆల్ టైమ్ హై: సెన్సెక్స్ 80,000 దాటింది',
                        content: '<p>ఈరోజు స్టాక్ మార్కెట్లు లాభాలతో ముగిశాయి. సెన్సెక్స్, నిఫ్టీలు రికార్డు స్థాయికి చేరుకున్నాయి. ఇన్వెస్టర్లు హర్షం వ్యక్తం చేస్తున్నారు.</p>'
                    },
                    {
                        title: 'బంగారం ధరల్లో భారీ తగ్గుదల',
                        content: '<p>గత కొద్ది రోజులుగా పెరుగుతున్న బంగారం ధరలు ఈరోజు తగ్గుముఖం పట్టాయి. కొనుగోలుదారులకు ఇది మంచి అవకాశమని నిపుణులు అంటున్నారు.</p>'
                    },
                    {
                        title: 'స్టార్టప్‌లకు కేంద్రం శుభవార్త',
                        content: '<p>కొత్తగా వ్యాపారం ప్రారంభించే వారికి పన్ను రాయితీలను కేంద్రం ప్రకటించింది. దీనివల్ల అంకుర సంస్థలు లాభపడనున్నాయి.</p>'
                    },
                    {
                        title: 'క్రిప్టోకరెన్సీ పై ఆర్బీఐ కీలక నిర్ణయం',
                        content: '<p>డిజిటల్ కరెన్సీ వినియోగంపై రిజర్వ్ బ్యాంక్ ఆఫ్ ఇండియా కొత్త మార్గదర్శకాలను విడుదల చేసింది.</p>'
                    },
                    {
                        title: 'ఐటీ రంగంలో నియామకాలు: ఫ్రెషర్లకు అవకాశాలు',
                        content: '<p>ప్రముఖ ఐటీ కంపెనీలు ఈ ఏడాది భారీగా నియామకాలు చేపట్టనున్నట్లు ప్రకటించాయి. ఇంజనీరింగ్ విద్యార్థులకు ఇది మంచి వార్త.</p>'
                    }
                ],
                'viral': [
                    {
                        title: 'సోషల్ మీడియాలో వైరల్ అవుతున్న కుక్కపిల్ల వీడియో',
                        content: '<p>ఒక చిన్న కుక్కపిల్ల చేసిన పని ఇప్పుడు నెట్టింట వైరల్ అవుతోంది. ఈ వీడియో చూస్తే మీరు నవ్వకుండా ఉండలేరు.</p>'
                    },
                    {
                        title: 'ఆశ్చర్యం: 100 ఏళ్ల వృద్ధుని సాహసం',
                        content: '<p>వందేళ్ల వయసులో కూడా పారాగ్లైడింగ్ చేసి అందరినీ ఆశ్చర్యపరిచారు ఓ వృద్ధుడు. ఆయన ధైర్యాన్ని నెటిజన్లు మెచ్చుకుంటున్నారు.</p>'
                    },
                    {
                        title: 'ట్రెండింగ్: ఈ రెస్టారెంట్‌లో రోబోలే సర్వర్లు',
                        content: '<p>హైదరాబాద్‌లోని ఓ రెస్టారెంట్‌లో రోబోలు ఆహారాన్ని వడ్డిస్తున్నాయి. ఇది చూడటానికి జనం ఎగబడుతున్నారు.</p>'
                    },
                    {
                        title: 'అరుదైన దృశ్యం: ఆకాశంలో ఆకుపచ్చ తోకచుక్క',
                        content: '<p>50 వేల ఏళ్లకు ఒకసారి కనిపించే అరుదైన తోకచుక్క నిన్న రాత్రి ఆకాశంలో కనువిందు చేసింది. ఫోటోలు వైరల్ అవుతున్నాయి.</p>'
                    },
                    {
                        title: 'ఫన్నీ మీమ్స్: వర్షం పై నెటిజన్ల సెటైర్లు',
                        content: '<p>హఠాత్తుగా కురిసిన వర్షంపై సోషల్ మీడియాలో ఫన్నీ మీమ్స్ వెల్లువెత్తాయి. ఇవి నవ్వులు పూయిస్తున్నాయి.</p>'
                    }
                ]
            };
            // const count = await prisma.article.count({ where: { categoryId: category.id } });
            // Always seed curated articles for now to ensure Telugu content appears
            // if (count < 5) { 
            const articlesToSeed = categoryArticles[category.slug] || [{ title: `${category.name} వార్తలు`, content: 'సాధారణ వార్తలు' }];
            console.log(`Seeding curated articles for ${category.name}...`);
            for (const [index, article] of articlesToSeed.entries()) {
                const slug = `${category.slug}-news-${index + 1}-${Date.now()}`;
                // Random seed for image to ensure variety but consistency
                const imageSeed = `${category.slug}${index}`;
                // Check if a similar title exists to avoid exact duplicates if re-running frequently, but slug is unique timestamped
                const exists = yield prisma.article.findFirst({ where: { title: article.title } });
                if (!exists) {
                    yield prisma.article.create({
                        data: {
                            title: article.title,
                            slug,
                            content: article.content + `<p>మరిన్ని వివరాలు త్వరలో..</p>`,
                            image: `https://picsum.photos/seed/${imageSeed}/800/600`, // random image
                            categoryId: category.id,
                            authorId: admin.id,
                            status: 'PUBLISHED',
                            isBreaking: index === 1, // Make the first one breaking
                            // views removed
                            publishedAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)), // Random past dateys
                            tags: {
                                connect: allTags.slice(0, 3).map((t) => ({ id: t.id })),
                            },
                        },
                    });
                }
            }
            // }
        }
        console.log('Seeding completed.');
        // Restore specific article for user verification
        const targetSlug = 'breaking-news-political-update-ap';
        const targetCategory = yield prisma.category.findUnique({ where: { slug: 'politics' } });
        if (targetCategory) {
            console.log(`Restoring ${targetSlug}...`);
            yield prisma.article.upsert({
                where: { slug: targetSlug },
                update: {
                    content: `
          <p><strong>రాజకీయాల అప్డేట్:</strong></p>
          <p>రాజధాని నుండి తాజా పరిణామాలు మీ ముందుకు. రాబోయే ఆర్థిక సంవత్సరానికి సంబంధించి విధానపరమైన మార్పులు జరిగే అవకాశం ఉందని విశ్లేషకులు భావిస్తున్నారు.</p>
          <p>ముఖ్యాంశాలు:</p>
          <ul>
            <li>ఆర్థిక సంస్కరణల కోసం కొత్త చట్టం ప్రతిపాదన.</li>
            <li>ప్రతిపక్షాలన్నీ ఏకతాటిపైకి రావడానికి ప్రయత్నాలు.</li>
            <li>పరిస్థితిని నిశితంగా గమనిస్తున్న అంతర్జాతీయ పరిశీలకులు.</li>
          </ul>
          <p>ఈ కథనం పై మరిన్ని వివరాలు త్వరలో అందిస్తాం. వేచి ఉండండి.</p>
        `, // Ensure content is not empty
                    showFeaturedImage: true,
                    isBreaking: true,
                    image: 'https://images.unsplash.com/photo-1529101091760-61df6be21965?auto=format&fit=crop&q=80&w=800'
                },
                create: {
                    title: 'బ్రేకింగ్ న్యూస్: రాజకీయాల అప్డేట్ ఏపీ',
                    slug: targetSlug,
                    content: `
          <p><strong>రాజకీయాల అప్డేట్:</strong></p>
          <p>రాజధాని నుండి తాజా పరిణామాలు మీ ముందుకు. రాబోయే ఆర్థిక సంవత్సరానికి సంబంధించి విధానపరమైన మార్పులు జరిగే అవకాశం ఉందని విశ్లేషకులు భావిస్తున్నారు.</p>
          <p>ముఖ్యాంశాలు:</p>
          <ul>
            <li>ఆర్థిక సంస్కరణల కోసం కొత్త చట్టం ప్రతిపాదన.</li>
            <li>ప్రతిపక్షాలన్నీ ఏకతాటిపైకి రావడానికి ప్రయత్నాలు.</li>
            <li>పరిస్థితిని నిశితంగా గమనిస్తున్న అంతర్జాతీయ పరిశీలకులు.</li>
          </ul>
          <p>ఈ కథనం పై మరిన్ని వివరాలు త్వరలో అందిస్తాం. వేచి ఉండండి.</p>
        `,
                    categoryId: targetCategory.id,
                    authorId: admin.id, // using the admin user created/found earlier
                    status: 'PUBLISHED',
                    isBreaking: true,
                    showFeaturedImage: true,
                    image: 'https://images.unsplash.com/photo-1529101091760-61df6be21965?auto=format&fit=crop&q=80&w=800',
                    // views removed
                    publishedAt: new Date()
                }
            });
            console.log(`Ensured article ${targetSlug} exists with content.`);
        }
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
