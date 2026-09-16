const productPath = '/products/grass-fed-beef-tallow-balm/';
const amazon = { label: 'ChiroLife product listing on Amazon', href: 'https://www.amazon.com/dp/B0GTVRQHN6' };
const seller = { label: 'ChiroLife Store seller profile on Amazon', href: 'https://www.amazon.com/sp?seller=A11S86SQ51O2VO' };
const clinic = { label: 'Cleveland Clinic: Beef Tallow for Skin: Is It Useful?', href: 'https://health.clevelandclinic.org/beef-tallow-for-skin' };
const moisturizer = { label: 'American Academy of Dermatology: Choosing a moisturizer', href: 'https://www.aad.org/public/everyday-care/skin-care-basics/dry/pick-moisturizer' };
const drySkin = { label: 'American Academy of Dermatology: Dry skin care', href: 'https://www.aad.org/public/everyday-care/skin-care-basics/dry/dermatologists-tips-relieve-dry-skin' };
const link = (label, href) => ({ label, href });
const section = (id, heading, paragraphs, extra = {}) => ({ id, heading, paragraphs, ...extra });

const pages = [
  {
    path: '/ingredients/', label: 'Ingredients', eyebrow: 'Inside the Jar',
    title: 'Tallow, Honey & Beeswax Balm Ingredients | ChiroLife',
    heading: 'Three Ingredients. One Simple Balm.',
    description: 'Explore the three ingredients in ChiroLife balm: grass-fed beef tallow, honey and beeswax. Read the ingredient list and product care guidance.',
    intro: 'ChiroLife brings together grass-fed beef tallow, wild honey and beeswax in a whipped balm for face and body. The Amazon ingredient list names beef tallow, honey and beeswax.',
    image: 'result-process.webp', imageAlt: 'Tallow, honey and beeswax with a three-ingredient label',
    sections: [
      section('tallow', 'Grass-Fed Beef Tallow', ['Tallow is the rich base of the balm. The product listing describes it as grass-fed. It softens as you warm a small amount between your fingertips, making the balm easy to spread.']),
      section('honey', 'Wild Honey', ['Honey is one of the three listed ingredients. It is blended into the moisturizing formula; this balm is intended for cosmetic use on the skin.']),
      section('beeswax', 'Beeswax', ['Beeswax contributes to the balm’s texture and its protective feel on the skin. ChiroLife pairs it with tallow and honey in a single jar.']),
      section('label', 'Read the Label on Your Jar', ['A short ingredient list is useful when comparing products, but it does not guarantee that a formula will suit every person. Check the label before use, especially if you know you react to an ingredient.', 'For questions about a particular batch or sourcing, contact ChiroLife with the product name and the details printed on your jar.'], { links: [link('Ask an ingredient question', '/contact/')] }),
    ],
    sources: [amazon], related: ['/how-to-use-tallow-balm/', '/beef-tallow-for-skin/'],
  },
  {
    path: '/how-to-use-tallow-balm/', label: 'How to Use', eyebrow: 'Your Everyday Ritual', isArticle: true,
    title: 'How to Use Tallow Balm on Face & Body | ChiroLife',
    heading: 'How to Use Tallow Balm on Your Face and Body',
    description: 'Learn how much ChiroLife tallow balm to use, how to apply it to face and body, and how to store your jar. Start small and patch-test first.',
    intro: 'Start with a small amount, warm it between clean fingertips and gently massage it into the skin. For the face, begin with less than a pea-sized amount and add more only if needed.',
    image: 'application.webp', imageAlt: 'A woman applying ChiroLife balm to her face',
    sections: [
      section('before-use', 'Before Your First Application', ['Read the label and check the ingredients. The Amazon safety information calls for a patch test before first use, external use only and avoiding the eyes. Stop using the balm if irritation develops.', 'Trying a small area first helps you notice how your skin responds before you spread the balm more widely. A three-ingredient formula can still cause sensitivity.']),
      section('steps', 'Apply in Three Simple Steps', [], { steps: ['Use clean fingertips to take a small amount from the jar. Start with a pea-sized amount for a small body area, or less for the face.', 'Warm the balm between your fingertips until it is easier to spread.', 'Massage gently over the area. Pause before adding more; a thin layer may be enough.'] }),
      section('face-body', 'Adjust the Amount to the Area', ['The face and neck usually need a smaller amount than larger body areas. Hands, cuticles, elbows and knees are other places to use the balm when you want extra moisture.', 'If it feels heavier than you prefer, try less on the next application. Do not assume that a thicker layer will produce better results. Choose a texture that feels comfortable for you.']),
      section('storage', 'Close the Jar After Use', ['Keep the lid tightly closed and store the balm somewhere cool and dry, away from sunlight and heat. Follow any storage or use-by guidance on your packaging.', 'Avoid the eye area. If contact occurs, rinse with water. Keep the jar out of children’s reach. For a question about the condition of your product, contact us before continuing to use it.'], { links: [link('Contact ChiroLife', '/contact/')] }),
    ], sources: [amazon], related: ['/ingredients/', '/tallow-balm-for-dry-skin/'],
  },
  {
    path: '/about/', label: 'About', eyebrow: 'Rooted in Simplicity',
    title: 'About ChiroLife | Simple Three-Ingredient Skincare', heading: 'Skincare, Made Easier to Understand.',
    description: 'Meet ChiroLife: a three-ingredient whipped tallow balm for everyday moisture. Learn about the formula and find the brand’s Amazon seller information.',
    intro: 'ChiroLife focuses on a simple everyday product: a whipped balm made with grass-fed beef tallow, wild honey and beeswax, for face and body.',
    image: 'hero-product.webp', imageAlt: 'The ChiroLife whipped beef tallow balm jar',
    sections: [
      section('approach', 'A Short Ingredient List. A Clear Purpose.', ['Our aim is to make the jar easy to understand: what is in it, how to apply it and where to find help. We describe ChiroLife as a cosmetic moisturizer for skin that needs extra softness and comfort.', 'Explore the formula and application guidance before deciding whether the balm fits your routine.'], { links: [link('Explore the ingredients', '/ingredients/'), link('Learn how to apply it', '/how-to-use-tallow-balm/')] }),
      section('buying', 'Find ChiroLife on Amazon', ['Purchases are completed on Amazon. The listing connects to ChiroLife Store, whose public seller profile identifies the business as Luxe Aya LLC.', 'For questions about the balm, email chirolifehelp@gmail.com. For an existing Amazon order, use your order page for the available delivery and return options.'], { links: [seller, link('Contact and seller details', '/contact/')] }),
    ], sources: [amazon, seller], related: ['/ingredients/', '/shipping/'],
  },
  {
    path: '/contact/', label: 'Contact', eyebrow: 'Here to Help',
    title: 'Contact ChiroLife | Product & Order Support', heading: 'Let’s Talk About Your Balm.',
    description: 'Contact ChiroLife for product questions, find Amazon order support and view the public business details for ChiroLife Store.',
    intro: 'Have a question about ingredients, application or your jar? Email chirolifehelp@gmail.com. For delivery, cancellations or returns on an Amazon order, start with your Amazon order details.',
    sections: [
      section('product-support', 'Product Questions', ['Include the product name and your question. If your question concerns a specific jar, include its batch information if available.'], { links: [link('chirolifehelp@gmail.com', 'mailto:chirolifehelp@gmail.com')] }),
      section('order-support', 'Amazon Order Help', ['Open Your Orders on Amazon and select the ChiroLife purchase to see the support options for that order. Avoid sending payment details or account passwords by email.'], { links: [link('Your Orders on Amazon', 'https://www.amazon.com/gp/css/order-history'), link('Delivery information', '/shipping/'), link('Returns and replacements', '/returns/')] }),
      section('seller-details', 'Amazon Seller Information', ['The ChiroLife Store profile on Amazon lists the following business details. This is the seller’s business address, not a return-shipping instruction.'], { facts: [
        { label: 'Seller', value: 'ChiroLife Store' }, { label: 'Business name', value: 'Luxe Aya LLC' },
        { label: 'Business address', value: '850 Twin Rivers Dr #1930, SMB#86458, Columbus, OH 43216, US' },
      ], links: [seller] }),
    ], sources: [seller], related: ['/shipping/', '/returns/'],
  },
  {
    path: '/shipping/', label: 'Shipping', eyebrow: 'From Checkout to Your Door',
    title: 'Shipping & Delivery Information | ChiroLife', heading: 'Your Amazon Order, Explained.',
    description: 'Learn where to check ChiroLife delivery dates, shipping charges and tracking for purchases made through Amazon.',
    intro: 'ChiroLife purchases are completed on Amazon. Enter your delivery address there to see the available shipping options and estimated arrival date for your order.',
    sections: [
      section('checkout', 'Before You Order', ['Check the seller, delivery estimate and shipping cost shown for your selected offer at checkout. These can depend on your location, the offer and your Amazon account.', 'The ChiroLife offer viewed on September 15, 2026 was sold by ChiroLife Store and shipped by Amazon. Confirm those details on the current listing; they can change.']),
      section('tracking', 'Track an Existing Order', ['Go to Your Orders, select your ChiroLife purchase and view the delivery information. Use the help options shown there if your package is late, missing or damaged.'], { links: [link('Open Your Orders on Amazon', 'https://www.amazon.com/gp/css/order-history')] }),
      section('arrival', 'When Your Jar Arrives', ['Check the packaging and label before using the balm. Store the jar in a cool, dry place away from direct sunlight. If the order arrives damaged, check the return or replacement options for that order.'], { links: [link('Returns and replacements', '/returns/'), link('Product questions', '/contact/')] }),
    ], sources: [amazon], related: ['/returns/', '/how-to-use-tallow-balm/'],
  },
  {
    path: '/returns/', label: 'Returns', eyebrow: 'Help With Your Purchase',
    title: 'Returns & Replacements for Amazon Orders | ChiroLife', heading: 'Returns Start With Your Order.',
    description: 'Find return and replacement help for ChiroLife purchases on Amazon. Check eligibility and follow the instructions attached to your order.',
    intro: 'For a ChiroLife purchase on Amazon, check the return or replacement options in Your Orders. The conditions and deadlines displayed for your order govern the available options.',
    sections: [
      section('request', 'Find the Available Options', [], { steps: ['Sign in to the Amazon account used for the purchase and open Your Orders.', 'Select your ChiroLife order and open the available return, replacement or support option.', 'Follow Amazon’s instructions, including any shipping label or drop-off directions provided.'] }),
      section('before-sending', 'Before Sending Anything Back', ['Do not mail your jar to the business address on our contact page. Use only the return destination and instructions supplied for your order.', 'Check the listing before buying and the order details afterward for the applicable return window, product-condition requirements and any charges.']),
      section('questions', 'Need Help With the Product?', ['For questions about ingredients, application or the condition of your jar, email ChiroLife. For refund status and order changes, use Amazon’s support options for the purchase.'], { links: [link('Contact ChiroLife', '/contact/'), link('Your Orders on Amazon', 'https://www.amazon.com/gp/css/order-history')] }),
    ], sources: [{ label: 'Amazon.com Return Policy', href: 'https://www.amazon.com/gp/help/customer/display.html?nodeId=GKM69DUUYKQWKWX7' }, seller], related: ['/shipping/', '/contact/'],
  },
  {
    path: '/beef-tallow-for-skin/', label: 'What Is Tallow Balm?', eyebrow: 'The Basics', isArticle: true,
    title: 'What Is Beef Tallow Balm? Ingredients & Uses | ChiroLife', heading: 'What Is Beef Tallow Balm?',
    description: 'Understand beef tallow balm, its texture and ingredients, and the limits of skincare claims. A practical introduction to ChiroLife’s three-ingredient formula.',
    intro: 'Beef tallow balm is a skincare preparation that uses rendered beef fat as a base. ChiroLife blends it with honey and beeswax in a whipped formula intended for cosmetic moisture on the face and body.',
    image: 'result-process.webp', imageAlt: 'Tallow, honey and beeswax arranged together',
    sections: [
      section('formula', 'The Name Describes an Ingredient, Not a Standard Formula', ['Different tallow balms can contain different oils, waxes, fragrances or other ingredients. Always compare the full ingredient lists rather than assuming that every product called “tallow balm” is the same.', 'For ChiroLife, Amazon lists beef tallow, honey and beeswax. The product is offered in a 4.4 oz jar, with a whipped texture for application to face and body.'], { links: [link('Read the ChiroLife ingredient guide', '/ingredients/')] }),
      section('feel', 'What Does Whipped Mean?', ['Whipped describes the texture. Take a small amount and warm it between your fingertips before spreading it. How much you enjoy that feel is a personal preference; it is not a measure of clinical effectiveness.', 'A jar format lets you choose the amount for a small area such as your cuticles or a larger area such as your hands. Start with less than you think you need.']),
      section('evidence', 'Keep Expectations Grounded', ['Cleveland Clinic notes that research on tallow skincare is limited and does not recommend it over more established moisturizers. It also describes possible irritation, clogged pores and allergic reactions.', 'ChiroLife is presented here as a cosmetic moisturizer. Do not use it as a substitute for prescribed treatment or sun protection. If you have an ongoing skin condition, ask a dermatologist about products that suit you.']),
      section('first-jar', 'Before You Try a New Jar', ['Read the current label, patch-test first and observe how your skin responds. Stop using the product if irritation occurs. The word “natural” does not guarantee that an ingredient will agree with your skin.'], { links: [link('See the application guide', '/how-to-use-tallow-balm/')] }),
    ], sources: [amazon, clinic], related: ['/tallow-balm-vs-lotion/', '/how-to-use-tallow-balm/'],
  },
  {
    path: '/tallow-balm-for-dry-skin/', label: 'Balm and Dry Skin', eyebrow: 'Everyday Care', isArticle: true,
    title: 'Tallow Balm for Dry Skin: What to Expect | ChiroLife', heading: 'Tallow Balm for Dry Skin: What to Expect',
    description: 'Set realistic expectations for tallow balm on dry skin. Learn about comfort, application and when to seek advice for persistent dryness.',
    intro: 'Think of ChiroLife as a cosmetic balm for softness and moisturizing comfort. It is not a treatment for a skin disease, and there is no promised timeline or guaranteed transformation.',
    image: 'application.webp', imageAlt: 'Applying ChiroLife balm as part of a skincare routine',
    sections: [
      section('expectations', 'Evaluate Comfort, Not a Before-and-After Promise', ['Notice whether you like the texture and how your skin feels after applying a small amount. If the balm feels too heavy, use less rather than repeatedly adding layers.', 'Individual experiences do not establish that a product will work the same way for everyone. Seller feedback and product ratings can help with shopping, but they are not clinical evidence.']),
      section('routine', 'Keep the Rest of Your Routine Gentle', ['The American Academy of Dermatology recommends gentle, fragrance-free skincare, short warm showers and applying moisturizer after washing. For dry skin, it generally favors creams or ointments over lotions.', 'That general guidance is not an endorsement of ChiroLife or tallow. Choose products based on your skin’s response and professional advice when needed.']),
      section('starting', 'Start With a Small Area', ['Check the ingredient list and patch-test before broader use, as directed in the product’s safety information. Keep it away from the eyes and stop if irritation develops.', 'For application, warm a small amount between clean fingertips and spread gently. Store the closed jar away from heat and sunlight.'], { links: [link('Step-by-step application', '/how-to-use-tallow-balm/')] }),
      section('persistent', 'When Dryness Needs More Than a Cosmetic Product', ['If dryness persists, becomes painful or is accompanied by a rash, seek advice from a dermatologist. Avoid treating a skin condition by simply adding more balm.', 'Cleveland Clinic highlights limited research on tallow skincare and potential reactions. A simple ingredient list should not be interpreted as a guarantee for sensitive or acne-prone skin.']),
    ], sources: [drySkin, clinic, amazon], related: ['/tallow-balm-vs-lotion/', '/how-to-use-tallow-balm/'],
  },
  {
    path: '/tallow-balm-vs-lotion/', label: 'Balm vs. Lotion', eyebrow: 'Find Your Texture', isArticle: true,
    title: 'Tallow Balm vs. Lotion: What Is Different? | ChiroLife', heading: 'Tallow Balm vs. Lotion: What Is the Difference?',
    description: 'Compare tallow balm and lotion by texture, ingredient list and application. Learn what to check when choosing a moisturizer for your routine.',
    intro: 'The useful comparison is the finished formula: its ingredients, texture and how much you like using it. “Tallow” names an ingredient; “lotion” describes a type of product. Neither name alone tells you which will suit your skin.',
    image: 'hero-product.webp', imageAlt: 'ChiroLife balm in its 4.4 oz jar',
    sections: [
      section('comparison', 'Compare the Details on the Label', [], { comparison: [
        { feature: 'Texture', balm: 'ChiroLife has a rich, whipped texture that softens as you warm it.', lotion: 'Lotions are typically thinner than creams; the feel depends on the formula.' },
        { feature: 'Ingredients', balm: 'ChiroLife lists beef tallow, honey and beeswax.', lotion: 'Check the full list for each lotion, including fragrance and ingredients you avoid.' },
        { feature: 'Application', balm: 'Take a small amount from the jar and warm it between fingertips.', lotion: 'Follow the directions on the bottle; packaging and recommended amounts vary.' },
        { feature: 'Choosing', balm: 'Consider whether you prefer a rich balm for a particular area.', lotion: 'Consider whether a lighter texture suits your routine.' },
      ] }),
      section('moisturizer', 'Where Creams and Ointments Fit', ['The American Academy of Dermatology describes creams as thicker and richer in oil than lotions. It suggests a cream or ointment for dry skin, while lighter textures can suit other preferences and skin types.', 'Those categories are a starting point, not a ranking of every product. A tallow balm is not automatically better because it has fewer ingredients.']),
      section('decision', 'Three Questions Before You Choose', [], { list: ['Does the ingredient list contain something you already know you react to?', 'Does the texture feel comfortable on the area where you plan to use it?', 'Are the claims realistic, and are the directions and seller details easy to find?'] }),
      section('trying', 'Try a New Formula Thoughtfully', ['Introduce a new product with a patch test and follow its label. If you have a diagnosed skin condition, use your clinician’s advice when deciding whether to change products.', 'For ChiroLife, the product page brings the ingredient list, application guidance and purchasing link together so you can review them before ordering.']),
    ], sources: [moisturizer, amazon], related: ['/beef-tallow-for-skin/', '/tallow-balm-for-dry-skin/'],
  },
];

module.exports = pages.map(page => ({
  template: 'editorial', ogType: page.isArticle ? 'article' : 'website',
  author: 'ChiroLife', updated: '2026-09-15', updatedLabel: 'September 15, 2026',
  productPath, ...page,
}));
