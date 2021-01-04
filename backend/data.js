import bcrypt from 'bcryptjs';

const data = {
    users: [
        {
            name: 'aviad',
            email: 'admin@example.com',
            password: bcrypt.hashSync('1234', 8),
            isAdmin: true,
        },
        {
            name: 'jhon',
            email: 'jhon@example.com',
            password: bcrypt.hashSync('1234', 8),
            isAdmin: false,
        }

    ],
    products: [
        {

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