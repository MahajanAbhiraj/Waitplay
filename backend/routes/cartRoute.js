import { PrismaClient } from '@prisma/client';
import express from 'express';
import crypto from 'crypto';
import QRCode from 'qrcode';

const router = express.Router();
const prisma = new PrismaClient();

// Create a new cart
router.post('/create-cart', async (req, res) => {
    try {
        const { userId } = req.body;
        const cartId = crypto.randomBytes(4).toString('hex'); // Generate a unique cart ID

        const newCart = await prisma.cart.create({
            data: {
                cartId,
                createdBy: userId,
                users: { set: [userId] } // Store user IDs as an array
            }
        });

        const qrCode = await QRCode.toDataURL(cartId);
        res.status(201).json({ cartId, qrCode });

    } catch (error) {
        res.status(500).json({ message: 'Error creating cart', error: error.message });
    }
});

// Join an existing cart
router.post('/join-cart', async (req, res) => {
    try {
        const { cartId, userId } = req.body;

        const cart = await prisma.cart.findUnique({
            where: { cartId }
        });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        if (!cart.users.includes(userId)) {
            await prisma.cart.update({
                where: { cartId },
                data: { users: { push: userId } }
            });
        }

        io.to(cartId).emit('cart-updated', cart);
        res.status(200).json({ message: 'Successfully joined the cart', cartId });

    } catch (error) {
        res.status(500).json({ message: 'Error joining cart', error: error.message });
    }
});

// Add an item to the cart
router.post('/cart/:cartId/add-item', (req, res) => {
    res.status(200).json({ message: 'Request successful' });
});

// Retrieve cart details
router.get('/cart/:cartId', async (req, res) => {
    try {
        const { cartId } = req.params;

        const cart = await prisma.cart.findUnique({
            where: { cartId }
        });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        res.status(200).json(cart);

    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart', error: error.message });
    }
});

export default router;
