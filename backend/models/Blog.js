const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    excerpt: {
        type: String,
        required: true,
        maxlength: 300
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        enum: ['testimony', 'devotional', 'teaching', 'news', 'announcement', 'ministry-update', 'community'],
        required: true
    },
    tags: [String],
    featuredImage: {
        url: String,
        alt: String,
        caption: String
    },
    images: [{
        url: String,
        alt: String,
        caption: String
    }],
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    },
    featured: {
        type: Boolean,
        default: false
    },
    publishedAt: {
        type: Date
    },
    scheduledAt: {
        type: Date
    },
    views: {
        type: Number,
        default: 0
    },
    likes: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        likedAt: {
            type: Date,
            default: Date.now
        }
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        comment: {
            type: String,
            required: true
        },
        commentedAt: {
            type: Date,
            default: Date.now
        },
        approved: {
            type: Boolean,
            default: false
        },
        replies: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            reply: String,
            repliedAt: {
                type: Date,
                default: Date.now
            }
        }]
    }],
    readTime: {
        type: Number, // in minutes
        default: 0
    },
    seoData: {
        metaTitle: String,
        metaDescription: String,
        keywords: [String]
    },
    relatedPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    }],
    allowComments: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Indexes
blogSchema.index({ slug: 1 });
blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ category: 1 });
blogSchema.index({ featured: 1 });
blogSchema.index({ tags: 1 });

// Pre-save middleware
blogSchema.pre('save', function(next) {
    // Set publishedAt when status changes to published
    if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
        this.publishedAt = new Date();
    }
    
    // Calculate read time (average 200 words per minute)
    if (this.isModified('content')) {
        const wordCount = this.content.split(/\s+/).length;
        this.readTime = Math.ceil(wordCount / 200);
    }
    
    next();
});

// Generate slug from title
blogSchema.methods.generateSlug = function() {
    const baseSlug = this.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    
    this.slug = baseSlug;
    return this.save();
};

module.exports = mongoose.model('Blog', blogSchema);
