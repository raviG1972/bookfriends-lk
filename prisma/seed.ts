import { db } from '../src/lib/db';

const categories = [
  { name: 'Fiction & Novels', nameSi: 'ප්‍රබන්ධ සහ නවකතා', nameTa: 'புனைவு மற்றும் நாவல்கள்', icon: '📖', slug: 'fiction' },
  { name: "Children's Books", nameSi: 'ළමා පොත්', nameTa: 'குழந்தைகள் புத்தகங்கள்', icon: '🧸', slug: 'children' },
  { name: 'Biography', nameSi: 'චරිතාපදාන', nameTa: 'சுயசரிதை', icon: '👤', slug: 'biography' },
  { name: 'History', nameSi: 'ඉතිහාසය', nameTa: 'வரலாறு', icon: '🏛️', slug: 'history' },
  { name: 'Self-Help', nameSi: 'ස්වයං සහාය', nameTa: 'சுய உதவி', icon: '🧘', slug: 'self-help' },
  { name: 'Poetry', nameSi: 'කවි', nameTa: 'கவிதை', icon: '🌸', slug: 'poetry' },
  { name: 'Science', nameSi: 'විද්‍යාව', nameTa: 'அறிவியல்', icon: '🔬', slug: 'science' },
  { name: 'Ayurveda', nameSi: 'ආයුර්වේදය', nameTa: 'ஆயுர்வேதம்', icon: '🌿', slug: 'ayurveda' },
  { name: 'Astrology', nameSi: 'ජ්‍යෝතිෂය', nameTa: 'ஜோதிடம்', icon: '🔮', slug: 'astrology' },
  { name: 'Adventure', nameSi: 'විස්සායන', nameTa: 'சாகசம்', icon: '🗺️', slug: 'adventure' },
  { name: 'Romance', nameSi: 'ප්‍රේම වෘත්තී', nameTa: 'காதல் கதைகள்', icon: '💕', slug: 'romance' },
  { name: 'Cooking', nameSi: 'කෑම සෑදීම', nameTa: 'சமையல்', icon: '🍳', slug: 'cooking' },
  { name: 'Dictionaries', nameSi: 'ශබ්දකෝෂ', nameTa: 'அகராதிகள்', icon: '📚', slug: 'dictionaries' },
  { name: 'Teens', nameSi: 'යොවුන්', nameTa: 'இளம் வயதினர்', icon: '🎯', slug: 'teens' },
  { name: 'Religion', nameSi: 'ආගම', nameTa: 'மதம்', icon: '🙏', slug: 'religion' },
  { name: 'Business', nameSi: 'ව්‍යාපාර', nameTa: 'வணிகம்', icon: '💼', slug: 'business' },
];

const books = [
  { title: 'සරයන් අත්හගේ කතා', author: 'ප්‍රේමදාස ශ්‍රී අලවත්තගේ', publisher: 'S. Godage & Brothers', language: 'sinhala', category: 'children', cover: '/covers/book1.png', likes: 234, reading: 1200, listening: 89, year: 1985, pages: 120, description: 'A beloved Sinhala children\'s story about a young boy named Sarayan and his adventures with a gentle elephant in a rural Sri Lankan village. Filled with warmth, humor, and valuable life lessons.' },
  { title: 'The Tea Garden Mystery', author: 'Michael Ondaatje', publisher: 'Perera-Hussein', language: 'english', category: 'fiction', cover: '/covers/book2.png', likes: 567, reading: 3400, listening: 234, year: 2019, pages: 342, description: 'A captivating literary fiction novel set in the misty tea plantations of Nuwara Eliya. When a young planter disappears, the secrets buried in the emerald hills begin to surface.' },
  { title: 'මල් සුවඳ කවි', author: 'මහාගම සේකේර', publisher: 'M.D. Gunasena', language: 'sinhala', category: 'poetry', cover: '/covers/book3.png', likes: 189, reading: 890, listening: 56, year: 1998, pages: 88, description: 'A collection of exquisite Sinhala poetry exploring themes of love, nature, and spirituality. Each verse is a fragrant bloom in the garden of Sri Lankan literature.' },
  { title: 'Ancient Ceylon: Rise of Kingdoms', author: 'Prof. Senarath Paranavithana', publisher: 'Lake House', language: 'english', category: 'history', cover: '/covers/book4.png', likes: 445, reading: 2100, listening: 123, year: 2005, pages: 456, description: 'A comprehensive exploration of Sri Lanka\'s ancient civilizations, from the founding of Anuradhapura to the glory of Polonnaruwa. Richly illustrated with photographs and archaeological findings.' },
  { title: 'English-Sinhala Children\'s Dictionary', author: 'Educational Publications Dept', publisher: 'EAP Publications', language: 'english', category: 'dictionaries', cover: '/covers/book5.png', likes: 321, reading: 4500, listening: 78, year: 2020, pages: 200, description: 'A beautifully illustrated bilingual dictionary designed for young learners. Features over 2,000 words with colorful pictures, making learning both English and Sinhala fun and engaging.' },
  { title: 'හෙර්බල් වෙදකම', author: 'Dr. A. H. M. J. Pushpakumara', publisher: 'Sarasavi', language: 'sinhala', category: 'ayurveda', cover: '/covers/book6.png', likes: 278, reading: 1560, listening: 45, year: 2015, pages: 320, description: 'A comprehensive guide to traditional Sri Lankan Ayurvedic medicine, featuring detailed descriptions of medicinal plants, their properties, preparation methods, and traditional remedies passed down through generations.' },
  { title: 'Bandaranaike: The Man and His Vision', author: 'K. M. de Silva', publisher: 'Vijitha Yapa', language: 'english', category: 'biography', cover: '/covers/book7.png', likes: 398, reading: 1890, listening: 67, year: 2012, pages: 528, description: 'The definitive biography of S.W.R.D. Bandaranaike, one of Sri Lanka\'s most influential political leaders. This meticulously researched work reveals the man behind the legend and his lasting impact on the nation.' },
  { title: 'Leopard\'s Trail', author: 'Karen Connelly', publisher: 'Godage International', language: 'english', category: 'adventure', cover: '/covers/book8.png', likes: 612, reading: 2780, listening: 189, year: 2021, pages: 298, description: 'An thrilling adventure novel set in the untamed jungles of Yala National Park. When a young wildlife researcher encounters a mysterious leopard, she uncovers an ancient secret that could change everything.' },
  { title: 'ජ්‍යෝතිෂ දර්ශනය', author: 'ජ්‍යෝතිෂී සුමංගල', publisher: 'Ravaya Publications', language: 'sinhala', category: 'astrology', cover: '/covers/book9.png', likes: 456, reading: 3200, listening: 234, year: 2010, pages: 400, description: 'A comprehensive guide to Sinhala astrology covering zodiac signs, planetary positions, birth chart interpretations, and predictions. An essential reference for anyone interested in traditional Sri Lankan astrology.' },
  { title: 'Sunset at Hikkaduwa', author: 'Ameena Hussein', publisher: 'Perera-Hussein', language: 'english', category: 'teens', cover: '/covers/book10.png', likes: 289, reading: 1340, listening: 98, year: 2022, pages: 220, description: 'A heartwarming coming-of-age story set in the coastal town of Hikkaduwa. Two teenagers from different backgrounds find friendship and first love during one unforgettable summer.' },
  { title: 'The Summit Within', author: 'Daisaku Ikeda', publisher: 'S. Godage & Brothers', language: 'english', category: 'self-help', cover: '/covers/book11.png', likes: 534, reading: 4100, listening: 156, year: 2018, pages: 276, description: 'An inspirational guide to personal transformation and inner peace. Drawing from Buddhist philosophy and modern psychology, this book offers practical wisdom for overcoming life\'s challenges.' },
  { title: 'Sri Lankan Kitchen: 100 Recipes', author: 'Chandra Dissanayake', publisher: 'Stamford Lake', language: 'english', category: 'cooking', cover: '/covers/book12.png', likes: 423, reading: 2800, listening: 34, year: 2019, pages: 248, description: 'A beautifully photographed cookbook featuring 100 authentic Sri Lankan recipes. From aromatic rice dishes to spicy curries, sweet hoppers to fresh sambols — discover the rich flavors of Sri Lankan cuisine.' },
  // Extra books with reused covers to fill the feed
  { title: 'රන් සිරිපා', author: 'මාර්ටින් වික්‍රමසිංහ', publisher: 'S. Godage & Brothers', language: 'sinhala', category: 'fiction', cover: '/covers/book2.png', likes: 789, reading: 5600, listening: 345, year: 1975, pages: 380, description: 'A masterpiece of Sinhala literature exploring social themes through the life of a village goldsmith. Rich in cultural detail and human emotion.' },
  { title: 'The Ocean\'s Embrace', author: 'Michelle de Kretser', publisher: 'Perera-Hussein', language: 'english', category: 'romance', cover: '/covers/book10.png', likes: 345, reading: 1560, listening: 78, year: 2020, pages: 304, description: 'A sweeping romance that moves between Colombo and Melbourne. Two lovers separated by distance and time find that the ocean between them is both barrier and bridge.' },
  { title: 'Young Explorers: Wildlife of Sri Lanka', author: 'Jehan CanagaRetna', publisher: 'Jetwing', language: 'english', category: 'children', cover: '/covers/book8.png', likes: 267, reading: 1890, listening: 123, year: 2021, pages: 64, description: 'An exciting introduction to Sri Lanka\'s incredible wildlife for young readers. Packed with fun facts, stunning photographs, and activities.' },
  { title: 'විද්‍යාව හා ජීවිතය', author: 'මහාචාර්ය ජයන්ත ජයවර්ධන', publisher: 'Sarasavi', language: 'sinhala', category: 'science', cover: '/covers/book4.png', likes: 198, reading: 980, listening: 45, year: 2016, pages: 350, description: 'A fascinating exploration of how science impacts our daily lives. Written in accessible Sinhala for general readers curious about the world around them.' },
  { title: 'Buddhist Philosophy for Modern Life', author: 'Ven. Dr. Walpola Rahula', publisher: 'BPS Publications', language: 'english', category: 'religion', cover: '/covers/book3.png', likes: 567, reading: 3450, listening: 267, year: 2008, pages: 290, description: 'A clear and accessible introduction to core Buddhist teachings and how they apply to contemporary challenges. By one of Sri Lanka\'s most respected scholars.' },
  { title: 'Startup Sri Lanka', author: 'Rohan Jayaweera', publisher: 'Vijitha Yapa', language: 'english', category: 'business', cover: '/covers/book7.png', likes: 234, reading: 1230, listening: 56, year: 2023, pages: 240, description: 'An inspiring guide for aspiring entrepreneurs in Sri Lanka. Featuring real stories of local startups, practical advice, and insights into building successful businesses.' },
  { title: 'මා සහ මගේ පොත්', author: 'අශෝක පෙරේරා', publisher: 'M.D. Gunasena', language: 'sinhala', category: 'biography', cover: '/covers/book7.png', likes: 156, reading: 670, listening: 23, year: 2017, pages: 180, description: 'A touching memoir by a beloved Sri Lankan author, reflecting on the books that shaped his life and the literary journey that defined his career.' },
  { title: 'Island of Spells', author: 'Nihal de Silva', publisher: 'Godage International', language: 'english', category: 'adventure', cover: '/covers/book8.png', likes: 478, reading: 2340, listening: 178, year: 2014, pages: 356, description: 'A thrilling adventure that weaves through the ancient cities and magical landscapes of Sri Lanka. When a young archaeologist discovers an ancient manuscript, a dangerous quest begins.' },
];

async function seed() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await db.book.deleteMany();
  await db.category.deleteMany();
  await db.user.deleteMany();

  // Create demo user
  const user = await db.user.create({
    data: {
      name: 'Demo User',
      email: 'demo@bookfriends.lk',
      password: 'demo123',
      preferredLanguages: 'sinhala,english',
    }
  });
  console.log('✅ Created demo user');

  // Create categories
  const createdCategories: Record<string, string> = {};
  for (const cat of categories) {
    const created = await db.category.create({
      data: {
        name: cat.name,
        nameSi: cat.nameSi,
        nameTa: cat.nameTa,
        icon: cat.icon,
        slug: cat.slug,
      }
    });
    createdCategories[cat.slug] = created.id;
  }
  console.log(`✅ Created ${categories.length} categories`);

  // Create books
  let bookCount = 0;
  for (const book of books) {
    const categoryId = createdCategories[book.category];
    await db.book.create({
      data: {
        title: book.title,
        author: book.author,
        publisher: book.publisher,
        language: book.language,
        categoryId: categoryId || null,
        coverImage: book.cover,
        description: book.description,
        year: book.year,
        pageCount: book.pages,
        likes: book.likes,
        readingCount: book.reading,
        listeningCount: book.listening,
        addedById: user.id,
        status: 'community',
      }
    });
    bookCount++;
  }
  console.log(`✅ Created ${bookCount} books`);

  // Update category book counts
  for (const [slug, catId] of Object.entries(createdCategories)) {
    const count = await db.book.count({ where: { categoryId: catId } });
    await db.category.update({ where: { id: catId }, data: { bookCount: count } });
  }
  console.log('✅ Updated category counts');

  console.log('🎉 Seeding complete!');
}

seed().catch(console.error);
