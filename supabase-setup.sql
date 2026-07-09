-- ============================================================
-- BookFriends.lk — Supabase (PostgreSQL) Setup Script
-- Paste this entire script into the Supabase SQL Editor and run it.
-- ============================================================

-- Grant default privileges
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated;

-- ============================================================
-- 1. TABLES
-- ============================================================

-- User
CREATE TABLE "User" (
  "id"                 TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "name"               TEXT NOT NULL,
  "email"              TEXT NOT NULL,
  "password"           TEXT NOT NULL,
  "avatar"             TEXT,
  "role"               TEXT NOT NULL DEFAULT 'reader',
  "preferredLanguages" TEXT NOT NULL DEFAULT 'english',
  "createdAt"          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- Category
CREATE TABLE "Category" (
  "id"        TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "name"      TEXT NOT NULL,
  "nameSi"    TEXT,
  "nameTa"    TEXT,
  "icon"      TEXT NOT NULL,
  "slug"      TEXT NOT NULL,
  "bookCount" INTEGER NOT NULL DEFAULT 0,

  CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- Book
CREATE TABLE "Book" (
  "id"             TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "title"          TEXT NOT NULL,
  "titleSi"        TEXT,
  "titleTa"        TEXT,
  "author"         TEXT NOT NULL,
  "publisher"      TEXT,
  "isbn"           TEXT,
  "language"       TEXT NOT NULL DEFAULT 'english',
  "year"           INTEGER,
  "pageCount"      INTEGER,
  "description"    TEXT,
  "coverImage"     TEXT,
  "categoryId"     TEXT,
  "status"         TEXT NOT NULL DEFAULT 'community',
  "addedById"      TEXT NOT NULL,
  "claimedById"    TEXT,
  "likes"          INTEGER NOT NULL DEFAULT 0,
  "readingCount"   INTEGER NOT NULL DEFAULT 0,
  "listeningCount" INTEGER NOT NULL DEFAULT 0,
  "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Book_categoryId_idx" ON "Book"("categoryId");
CREATE INDEX "Book_addedById_idx" ON "Book"("addedById");
CREATE INDEX "Book_claimedById_idx" ON "Book"("claimedById");

-- Bookshelf
CREATE TABLE "Bookshelf" (
  "id"      TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "userId"  TEXT NOT NULL,
  "bookId"  TEXT NOT NULL,
  "status"  TEXT NOT NULL DEFAULT 'want_to_read',
  "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Bookshelf_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Bookshelf_userId_bookId_key" ON "Bookshelf"("userId", "bookId");
CREATE INDEX "Bookshelf_userId_idx" ON "Bookshelf"("userId");
CREATE INDEX "Bookshelf_bookId_idx" ON "Bookshelf"("bookId");

-- Comment
CREATE TABLE "Comment" (
  "id"        TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "content"   TEXT NOT NULL,
  "userId"    TEXT NOT NULL,
  "bookId"    TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Comment_userId_idx" ON "Comment"("userId");
CREATE INDEX "Comment_bookId_idx" ON "Comment"("bookId");

-- PagePreview
CREATE TABLE "PagePreview" (
  "id"           TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "bookId"       TEXT NOT NULL,
  "pageNumber"   INTEGER NOT NULL,
  "content"      TEXT NOT NULL,
  "uploadedById" TEXT NOT NULL,
  "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "PagePreview_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "PagePreview_bookId_idx" ON "PagePreview"("bookId");
CREATE INDEX "PagePreview_uploadedById_idx" ON "PagePreview"("uploadedById");

-- PageRequest
CREATE TABLE "PageRequest" (
  "id"        TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "bookId"    TEXT NOT NULL,
  "userId"    TEXT NOT NULL,
  "chapter"   TEXT,
  "pages"     TEXT,
  "reason"    TEXT,
  "status"    TEXT NOT NULL DEFAULT 'pending',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "PageRequest_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "PageRequest_bookId_idx" ON "PageRequest"("bookId");
CREATE INDEX "PageRequest_userId_idx" ON "PageRequest"("userId");

-- BookEdit
CREATE TABLE "BookEdit" (
  "id"        TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "bookId"    TEXT NOT NULL,
  "userId"    TEXT NOT NULL,
  "field"     TEXT NOT NULL,
  "oldValue"  TEXT,
  "newValue"  TEXT NOT NULL,
  "status"    TEXT NOT NULL DEFAULT 'pending',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "BookEdit_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "BookEdit_bookId_idx" ON "BookEdit"("bookId");
CREATE INDEX "BookEdit_userId_idx" ON "BookEdit"("userId");

-- ============================================================
-- 2. FOREIGN KEYS (added after all tables exist)
-- ============================================================

-- Book → Category
ALTER TABLE "Book" ADD CONSTRAINT "Book_categoryId_fkey"
  FOREIGN KEY ("categoryId") REFERENCES "Category"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

-- Book → User (addedBy)
ALTER TABLE "Book" ADD CONSTRAINT "Book_addedById_fkey"
  FOREIGN KEY ("addedById") REFERENCES "User"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

-- Book → User (claimedBy)
ALTER TABLE "Book" ADD CONSTRAINT "Book_claimedById_fkey"
  FOREIGN KEY ("claimedById") REFERENCES "User"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

-- Bookshelf → User
ALTER TABLE "Bookshelf" ADD CONSTRAINT "Bookshelf_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- Bookshelf → Book
ALTER TABLE "Bookshelf" ADD CONSTRAINT "Bookshelf_bookId_fkey"
  FOREIGN KEY ("bookId") REFERENCES "Book"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- Comment → User
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- Comment → Book
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_bookId_fkey"
  FOREIGN KEY ("bookId") REFERENCES "Book"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- PagePreview → Book
ALTER TABLE "PagePreview" ADD CONSTRAINT "PagePreview_bookId_fkey"
  FOREIGN KEY ("bookId") REFERENCES "Book"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- PagePreview → User (uploadedBy)
ALTER TABLE "PagePreview" ADD CONSTRAINT "PagePreview_uploadedById_fkey"
  FOREIGN KEY ("uploadedById") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- PageRequest → User
ALTER TABLE "PageRequest" ADD CONSTRAINT "PageRequest_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- PageRequest → Book
ALTER TABLE "PageRequest" ADD CONSTRAINT "PageRequest_bookId_fkey"
  FOREIGN KEY ("bookId") REFERENCES "Book"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- BookEdit → User
ALTER TABLE "BookEdit" ADD CONSTRAINT "BookEdit_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- BookEdit → Book
ALTER TABLE "BookEdit" ADD CONSTRAINT "BookEdit_bookId_fkey"
  FOREIGN KEY ("bookId") REFERENCES "Book"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================================
-- 3. ROW LEVEL SECURITY (permissive for now)
-- ============================================================

ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON "User" FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON "Category" FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE "Book" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON "Book" FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE "Bookshelf" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON "Bookshelf" FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE "Comment" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON "Comment" FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE "PagePreview" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON "PagePreview" FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE "PageRequest" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON "PageRequest" FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE "BookEdit" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON "BookEdit" FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- 4. SEED DATA
-- ============================================================

-- 4a. Demo User
-- Password: demo123  |  Bcrypt hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
INSERT INTO "User" ("id", "name", "email", "password", "preferredLanguages", "createdAt", "updatedAt")
VALUES (
  'demo-user-001',
  'Demo User',
  'demo@bookfriends.lk',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'sinhala,english',
  '2024-01-01T00:00:00.000Z',
  '2024-01-01T00:00:00.000Z'
);

-- 4b. Categories (16)
INSERT INTO "Category" ("id", "name", "nameSi", "nameTa", "icon", "slug", "bookCount") VALUES
  ('cat-fiction',      'Fiction & Novels',    'ප්‍රබන්ධ සහ නවකතා', 'புனைவு மற்றும் நாவல்கள்', '📖', 'fiction',      2),
  ('cat-children',     'Children''s Books',   'ළමා පොත්',            'குழந்தைகள் புத்தகங்கள்', '🧸', 'children',     2),
  ('cat-biography',    'Biography',           'චරිතාපදාන',         'சுயசரிதை',                '👤', 'biography',    2),
  ('cat-history',      'History',             'ඉතිහාසය',              'வரலாறு',                  '🏛️', 'history',      1),
  ('cat-self-help',    'Self-Help',           'ස්වයං සහාය',           'சுய உதவி',                '🧘', 'self-help',    1),
  ('cat-poetry',       'Poetry',              'කවි',                  'கவிதை',                   '🌸', 'poetry',       1),
  ('cat-science',      'Science',             'විද්‍යාව',              'அறிவியல்',                '🔬', 'science',      1),
  ('cat-ayurveda',     'Ayurveda',            'ආයුර්වේදය',           'ஆயுர்வேதம்',              '🌿', 'ayurveda',     1),
  ('cat-astrology',    'Astrology',           'ජ්‍යෝතිෂය',             'ஜோதிடம்',                '🔮', 'astrology',    1),
  ('cat-adventure',    'Adventure',           'විස්සායන',             'சாகசம்',                 '🗺️', 'adventure',    2),
  ('cat-romance',      'Romance',             'ප්‍රේම වෘත්තී',        'காதல் கதைகள்',          '💕', 'romance',      1),
  ('cat-cooking',      'Cooking',             'කෑම සෑදීම',           'சமையல்',                 '🍳', 'cooking',      1),
  ('cat-dictionaries', 'Dictionaries',        'ශබ්දකෝෂ',             'அகராதிகள்',              '📚', 'dictionaries', 1),
  ('cat-teens',        'Teens',               'යොවුන්',               'இளம் வயதினர்',            '🎯', 'teens',        1),
  ('cat-religion',     'Religion',            'ආගම',                 'மதம்',                   '🙏', 'religion',     1),
  ('cat-business',     'Business',            'ව්‍යාපාර',              'வணிகம்',                  '💼', 'business',     1);

-- 4c. Books (20)
INSERT INTO "Book" ("id", "title", "author", "publisher", "language", "year", "pageCount", "description", "coverImage", "categoryId", "status", "addedById", "likes", "readingCount", "listeningCount", "createdAt", "updatedAt") VALUES
('seed-book-01',
 'සරයන් අත්හගේ කතා',
 'ප්‍රේමදාස ශ්‍රී අලවත්තගේ',
 'S. Godage & Brothers',
 'sinhala',
 1985, 120,
 'A beloved Sinhala children''s story about a young boy named Sarayan and his adventures with a gentle elephant in a rural Sri Lankan village. Filled with warmth, humor, and valuable life lessons.',
 '/covers/book1.png',
 'cat-children',
 'community',
 'demo-user-001',
 234, 1200, 89,
 '2024-01-15T10:00:00.000Z', '2024-01-15T10:00:00.000Z'),

('seed-book-02',
 'The Tea Garden Mystery',
 'Michael Ondaatje',
 'Perera-Hussein',
 'english',
 2019, 342,
 'A captivating literary fiction novel set in the misty tea plantations of Nuwara Eliya. When a young planter disappears, the secrets buried in the emerald hills begin to surface.',
 '/covers/book2.png',
 'cat-fiction',
 'community',
 'demo-user-001',
 567, 3400, 234,
 '2024-02-10T10:00:00.000Z', '2024-02-10T10:00:00.000Z'),

('seed-book-03',
 'මල් සුවඳ කවි',
 'මහාගම සේකේර',
 'M.D. Gunasena',
 'sinhala',
 1998, 88,
 'A collection of exquisite Sinhala poetry exploring themes of love, nature, and spirituality. Each verse is a fragrant bloom in the garden of Sri Lankan literature.',
 '/covers/book3.png',
 'cat-poetry',
 'community',
 'demo-user-001',
 189, 890, 56,
 '2024-03-05T10:00:00.000Z', '2024-03-05T10:00:00.000Z'),

('seed-book-04',
 'Ancient Ceylon: Rise of Kingdoms',
 'Prof. Senarath Paranavithana',
 'Lake House',
 'english',
 2005, 456,
 'A comprehensive exploration of Sri Lanka''s ancient civilizations, from the founding of Anuradhapura to the glory of Polonnaruwa. Richly illustrated with photographs and archaeological findings.',
 '/covers/book4.png',
 'cat-history',
 'community',
 'demo-user-001',
 445, 2100, 123,
 '2024-03-20T10:00:00.000Z', '2024-03-20T10:00:00.000Z'),

('seed-book-05',
 'English-Sinhala Children''s Dictionary',
 'Educational Publications Dept',
 'EAP Publications',
 'english',
 2020, 200,
 'A beautifully illustrated bilingual dictionary designed for young learners. Features over 2,000 words with colorful pictures, making learning both English and Sinhala fun and engaging.',
 '/covers/book5.png',
 'cat-dictionaries',
 'community',
 'demo-user-001',
 321, 4500, 78,
 '2024-04-01T10:00:00.000Z', '2024-04-01T10:00:00.000Z'),

('seed-book-06',
 'හෙර්බල් වෙදකම',
 'Dr. A. H. M. J. Pushpakumara',
 'Sarasavi',
 'sinhala',
 2015, 320,
 'A comprehensive guide to traditional Sri Lankan Ayurvedic medicine, featuring detailed descriptions of medicinal plants, their properties, preparation methods, and traditional remedies passed down through generations.',
 '/covers/book6.png',
 'cat-ayurveda',
 'community',
 'demo-user-001',
 278, 1560, 45,
 '2024-04-15T10:00:00.000Z', '2024-04-15T10:00:00.000Z'),

('seed-book-07',
 'Bandaranaike: The Man and His Vision',
 'K. M. de Silva',
 'Vijitha Yapa',
 'english',
 2012, 528,
 'The definitive biography of S.W.R.D. Bandaranaike, one of Sri Lanka''s most influential political leaders. This meticulously researched work reveals the man behind the legend and his lasting impact on the nation.',
 '/covers/book7.png',
 'cat-biography',
 'community',
 'demo-user-001',
 398, 1890, 67,
 '2024-05-01T10:00:00.000Z', '2024-05-01T10:00:00.000Z'),

('seed-book-08',
 'Leopard''s Trail',
 'Karen Connelly',
 'Godage International',
 'english',
 2021, 298,
 'An thrilling adventure novel set in the untamed jungles of Yala National Park. When a young wildlife researcher encounters a mysterious leopard, she uncovers an ancient secret that could change everything.',
 '/covers/book8.png',
 'cat-adventure',
 'community',
 'demo-user-001',
 612, 2780, 189,
 '2024-05-15T10:00:00.000Z', '2024-05-15T10:00:00.000Z'),

('seed-book-09',
 'ජ්‍යෝතිෂ දර්ශනය',
 'ජ්‍යෝතිෂී සුමංගල',
 'Ravaya Publications',
 'sinhala',
 2010, 400,
 'A comprehensive guide to Sinhala astrology covering zodiac signs, planetary positions, birth chart interpretations, and predictions. An essential reference for anyone interested in traditional Sri Lankan astrology.',
 '/covers/book9.png',
 'cat-astrology',
 'community',
 'demo-user-001',
 456, 3200, 234,
 '2024-06-01T10:00:00.000Z', '2024-06-01T10:00:00.000Z'),

('seed-book-10',
 'Sunset at Hikkaduwa',
 'Ameena Hussein',
 'Perera-Hussein',
 'english',
 2022, 220,
 'A heartwarming coming-of-age story set in the coastal town of Hikkaduwa. Two teenagers from different backgrounds find friendship and first love during one unforgettable summer.',
 '/covers/book10.png',
 'cat-teens',
 'community',
 'demo-user-001',
 289, 1340, 98,
 '2024-06-15T10:00:00.000Z', '2024-06-15T10:00:00.000Z'),

('seed-book-11',
 'The Summit Within',
 'Daisaku Ikeda',
 'S. Godage & Brothers',
 'english',
 2018, 276,
 'An inspirational guide to personal transformation and inner peace. Drawing from Buddhist philosophy and modern psychology, this book offers practical wisdom for overcoming life''s challenges.',
 '/covers/book11.png',
 'cat-self-help',
 'community',
 'demo-user-001',
 534, 4100, 156,
 '2024-07-01T10:00:00.000Z', '2024-07-01T10:00:00.000Z'),

('seed-book-12',
 'Sri Lankan Kitchen: 100 Recipes',
 'Chandra Dissanayake',
 'Stamford Lake',
 'english',
 2019, 248,
 'A beautifully photographed cookbook featuring 100 authentic Sri Lankan recipes. From aromatic rice dishes to spicy curries, sweet hoppers to fresh sambols — discover the rich flavors of Sri Lankan cuisine.',
 '/covers/book12.png',
 'cat-cooking',
 'community',
 'demo-user-001',
 423, 2800, 34,
 '2024-07-15T10:00:00.000Z', '2024-07-15T10:00:00.000Z'),

('seed-book-13',
 'රන් සිරිපා',
 'මාර්ටින් වික්‍රමසිංහ',
 'S. Godage & Brothers',
 'sinhala',
 1975, 380,
 'A masterpiece of Sinhala literature exploring social themes through the life of a village goldsmith. Rich in cultural detail and human emotion.',
 '/covers/book2.png',
 'cat-fiction',
 'community',
 'demo-user-001',
 789, 5600, 345,
 '2024-08-01T10:00:00.000Z', '2024-08-01T10:00:00.000Z'),

('seed-book-14',
 'The Ocean''s Embrace',
 'Michelle de Kretser',
 'Perera-Hussein',
 'english',
 2020, 304,
 'A sweeping romance that moves between Colombo and Melbourne. Two lovers separated by distance and time find that the ocean between them is both barrier and bridge.',
 '/covers/book10.png',
 'cat-romance',
 'community',
 'demo-user-001',
 345, 1560, 78,
 '2024-08-15T10:00:00.000Z', '2024-08-15T10:00:00.000Z'),

('seed-book-15',
 'Young Explorers: Wildlife of Sri Lanka',
 'Jehan CanagaRetna',
 'Jetwing',
 'english',
 2021, 64,
 'An exciting introduction to Sri Lanka''s incredible wildlife for young readers. Packed with fun facts, stunning photographs, and activities.',
 '/covers/book8.png',
 'cat-children',
 'community',
 'demo-user-001',
 267, 1890, 123,
 '2024-09-01T10:00:00.000Z', '2024-09-01T10:00:00.000Z'),

('seed-book-16',
 'විද්‍යාව හා ජීවිතය',
 'මහාචාර්ය ජයන්ත ජයවර්ධන',
 'Sarasavi',
 'sinhala',
 2016, 350,
 'A fascinating exploration of how science impacts our daily lives. Written in accessible Sinhala for general readers curious about the world around them.',
 '/covers/book4.png',
 'cat-science',
 'community',
 'demo-user-001',
 198, 980, 45,
 '2024-09-15T10:00:00.000Z', '2024-09-15T10:00:00.000Z'),

('seed-book-17',
 'Buddhist Philosophy for Modern Life',
 'Ven. Dr. Walpola Rahula',
 'BPS Publications',
 'english',
 2008, 290,
 'A clear and accessible introduction to core Buddhist teachings and how they apply to contemporary challenges. By one of Sri Lanka''s most respected scholars.',
 '/covers/book3.png',
 'cat-religion',
 'community',
 'demo-user-001',
 567, 3450, 267,
 '2024-10-01T10:00:00.000Z', '2024-10-01T10:00:00.000Z'),

('seed-book-18',
 'Startup Sri Lanka',
 'Rohan Jayaweera',
 'Vijitha Yapa',
 'english',
 2023, 240,
 'An inspiring guide for aspiring entrepreneurs in Sri Lanka. Featuring real stories of local startups, practical advice, and insights into building successful businesses.',
 '/covers/book7.png',
 'cat-business',
 'community',
 'demo-user-001',
 234, 1230, 56,
 '2024-10-15T10:00:00.000Z', '2024-10-15T10:00:00.000Z'),

('seed-book-19',
 'මා සහ මගේ පොත්',
 'අශෝක පෙරේරා',
 'M.D. Gunasena',
 'sinhala',
 2017, 180,
 'A touching memoir by a beloved Sri Lankan author, reflecting on the books that shaped his life and the literary journey that defined his career.',
 '/covers/book7.png',
 'cat-biography',
 'community',
 'demo-user-001',
 156, 670, 23,
 '2024-11-01T10:00:00.000Z', '2024-11-01T10:00:00.000Z'),

('seed-book-20',
 'Island of Spells',
 'Nihal de Silva',
 'Godage International',
 'english',
 2014, 356,
 'A thrilling adventure that weaves through the ancient cities and magical landscapes of Sri Lanka. When a young archaeologist discovers an ancient manuscript, a dangerous quest begins.',
 '/covers/book8.png',
 'cat-adventure',
 'community',
 'demo-user-001',
 478, 2340, 178,
 '2024-11-15T10:00:00.000Z', '2024-11-15T10:00:00.000Z');

-- ============================================================
-- DONE! All tables created, seeded with 16 categories, 20 books, and 1 demo user.
-- ============================================================