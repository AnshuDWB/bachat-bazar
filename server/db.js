import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  initialStoreSettings,
  initialCategories,
  initialProducts,
  initialUsers,
  initialOrders,
  initialWhatsAppConsents,
  initialWhatsAppTemplates,
  initialDataDeletionRequests,
  initialHeroSlides,
  initialMembershipPlans,
  initialMembershipRequests
} from './data/seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'data', 'db.json');

// In-memory cache synced with disk
let db = {
  settings: initialStoreSettings,
  categories: initialCategories,
  products: initialProducts,
  users: initialUsers,
  orders: initialOrders,
  whatsappConsents: initialWhatsAppConsents,
  whatsappTemplates: initialWhatsAppTemplates,
  dataDeletionRequests: initialDataDeletionRequests,
  heroSlides: initialHeroSlides,
  membershipPlans: initialMembershipPlans,
  membershipRequests: initialMembershipRequests
};

export function initDB() {
  try {
    if (!fs.existsSync(path.dirname(DB_FILE))) {
      fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      db = JSON.parse(data);
      // Ensure all root keys exist
      db.settings = { ...initialStoreSettings, ...(db.settings || {}) };
      db.categories = db.categories || initialCategories;
      db.products = db.products || initialProducts;
      db.users = db.users || initialUsers;
      db.orders = db.orders || initialOrders;
      db.whatsappConsents = db.whatsappConsents || initialWhatsAppConsents;
      db.whatsappTemplates = db.whatsappTemplates || initialWhatsAppTemplates;
      db.dataDeletionRequests = db.dataDeletionRequests || initialDataDeletionRequests;
      db.heroSlides = db.heroSlides && db.heroSlides.length > 0 ? db.heroSlides : initialHeroSlides;
      db.membershipPlans = db.membershipPlans && db.membershipPlans.length > 0 ? db.membershipPlans : initialMembershipPlans;
      db.membershipRequests = db.membershipRequests || initialMembershipRequests;
      console.log('📦 Database loaded from file with WhatsApp compliance, Hero Slides & Membership plans.');
    } else {
      saveDB();
      console.log('🌱 Seed database created with initial products, store settings & WhatsApp compliance.');
    }
  } catch (err) {
    console.error('Error initializing database:', err);
    saveDB();
  }
}

export function saveDB() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database:', err);
  }
}

export function getDB() {
  return db;
}
