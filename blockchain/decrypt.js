import * as crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const key = "123456tuvwxyz789";

export const decryptRequest = (text) => {
    try {
        const decipher = crypto.createDecipheriv(algorithm, key, text.iv);
        const decrpyted = Buffer.concat([decipher.update(text.content, 'base64'), decipher.final()]);
        return decrpyted.toString();
    } catch (error) {

        throw error;
    }
}