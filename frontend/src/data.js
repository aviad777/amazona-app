import bcrypt from 'bcryptjs'
const data = {

    users: [
        {
            name: 'Aviad',
            email: 'admin@example.com',
            password: bcrypt.hashSync('1234', 8),
            isAdmin: true,
            isSeller: true,
            seller: {
                name: 'Puma',
                logo: '/images/logo1.png',
                description: 'best seller',
                rating: 4.5,
                numReviews: 120,
            }
        },
        {
            name: 'John',
            email: 'user@example.com',
            password: bcrypt.hashSync('1234', 8),
            isAdmin: false,
        }
    ],




    products: [
        {
            _id: '1',
            name: 'Nike slim shirts',
            category: 'shirts',
            image: '/images/p1.jpg',
            price: 120,
            countInStock: 10,
            brand: 'Nike',
            rating: 4.5,
            numReviews: 10,
            description: 'high quality product'
        },
        {
            _id: '2',
            name: 'Adidas slim shirts',
            category: 'Shirts',
            image: '/images/p2.jpg',
            price: 100,
            countInStock: 20,
            brand: 'Adidas',
            rating: 4,
            numReviews: 10,
            description: 'high quality product'
        },
        {
            _id: '3',
            name: 'Lacoste free shirts',
            category: 'Shirts',
            image: '/images/p3.jpg',
            price: 220,
            countInStock: 0,
            brand: 'Lacoste',
            rating: 4.8,
            numReviews: 17,
            description: 'high quality product'
        },
        {
            _id: '4',
            name: 'Nike slim pants',
            category: 'Pants',
            image: '/images/p4.jpg',
            price: 140.78,
            countInStock: 15,
            brand: 'Nike',
            rating: 4.5,
            numReviews: 10,
            description: 'high quality product'
        },
        {
            _id: '5',
            name: 'Puma slim pants',
            category: 'pants',
            image: '/images/p5.jpg',
            price: 65,
            countInStock: 5,
            brand: 'puma',
            rating: 4.5,
            numReviews: 10,
            description: 'high quality product'
        },
        {
            _id: '6',
            name: 'Adidas fit shirts',
            category: 'Shirts',
            image: '/images/p6.jpg',
            price: 139,
            countInStock: 12,
            brand: 'Adidas',
            rating: 4.5,
            numReviews: 15,
            description: 'high quality product'
        },
    ]
}


export default data;