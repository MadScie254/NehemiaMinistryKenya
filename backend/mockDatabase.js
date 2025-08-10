// Mock database for testing without MongoDB
const users = [
    {
        _id: '1',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@nehemiaministry.org',
        password: '$2a$10$jK7ZQ9xK8LMNvVf2XCqQ0ePgKqLz8HuXYzGm3zFX8HzGmKrLkA8.a', // admin123
        role: 'admin',
        phone: '+254700000000',
        ministry: 'administration',
        isActive: true,
        memberSince: new Date('2024-01-01'),
        createdAt: new Date('2024-01-01')
    },
    {
        _id: '2',
        firstName: 'John',
        lastName: 'Doe',
        email: 'member@test.com',
        password: '$2a$10$EWKiY9mVf2XC1AcCpQ0eX.PgKqLz8HuXYzGm3zFX8HzGmKrLkA8.b', // member123
        role: 'member',
        phone: '+254700000001',
        ministry: 'youth',
        isActive: true,
        memberSince: new Date('2024-06-01'),
        createdAt: new Date('2024-06-01')
    }
];

const prayers = [
    {
        _id: '1',
        title: 'Prayer for Healing',
        content: 'Please pray for my mother who is in the hospital. She needs God\'s healing touch.',
        category: 'healing',
        priority: 'high',
        isPublic: true,
        requester: '2',
        status: 'active',
        createdAt: new Date('2024-08-10'),
        prayers: []
    },
    {
        _id: '2',
        title: 'Financial Breakthrough',
        content: 'Requesting prayers for financial breakthrough in my family business.',
        category: 'financial',
        priority: 'medium',
        isPublic: true,
        requester: '2',
        status: 'active',
        createdAt: new Date('2024-08-09'),
        prayers: []
    }
];

const events = [
    {
        _id: '1',
        title: 'Sunday Worship Service',
        description: 'Join us for our weekly worship service with powerful praise and worship.',
        category: 'worship',
        date: {
            start: new Date('2024-08-18T09:00:00'),
            end: new Date('2024-08-18T12:00:00')
        },
        location: 'Main Sanctuary',
        status: 'published',
        registrations: [{ user: '2', registeredAt: new Date() }],
        createdBy: '1',
        createdAt: new Date('2024-08-01')
    },
    {
        _id: '2',
        title: 'Youth Bible Study',
        description: 'Weekly youth bible study and fellowship.',
        category: 'bible-study',
        date: {
            start: new Date('2024-08-20T18:00:00'),
            end: new Date('2024-08-20T20:00:00')
        },
        location: 'Youth Hall',
        status: 'published',
        registrations: [],
        createdBy: '1',
        createdAt: new Date('2024-08-01')
    }
];

// Helper functions
const findUserByEmail = (email) => {
    return users.find(user => user.email === email);
};

const findUserById = (id) => {
    return users.find(user => user._id === id);
};

const findPrayersByUser = (userId) => {
    return prayers.filter(prayer => prayer.requester === userId);
};

const findPublicPrayers = () => {
    return prayers.filter(prayer => prayer.isPublic);
};

const findEventsByUser = (userId) => {
    return events.filter(event => 
        event.registrations.some(reg => reg.user === userId)
    );
};

const findUpcomingEvents = () => {
    const now = new Date();
    return events.filter(event => event.date.start > now);
};

const addPrayer = (prayerData) => {
    const newPrayer = {
        _id: (prayers.length + 1).toString(),
        ...prayerData,
        createdAt: new Date(),
        prayers: []
    };
    prayers.push(newPrayer);
    return newPrayer;
};

module.exports = {
    users,
    prayers,
    events,
    findUserByEmail,
    findUserById,
    findPrayersByUser,
    findPublicPrayers,
    findEventsByUser,
    findUpcomingEvents,
    addPrayer
};
