import crypto from 'crypto';
import { Tokens } from '../types';

export const sbot_test = (tokens: Tokens): string => {
	const t: number = Date.now();
	const nonce: string = Math.random().toString(32).substring(2); // 使い捨てのランダムな文字列
	const data: string = tokens.token + t.toString() + nonce;
	const signTerm: Buffer = crypto
		.createHmac('sha256', tokens.secret)
		.update(Buffer.from(data, 'utf-8'))
		.digest();
	const sign: string = signTerm.toString('base64');
	return sign;
};
