import crypto from "crypto";

const algorithm = "aes-256-gcm";

// 32 bytes key
const key = Buffer.from(process.env.ENCRYPTION_KEY, "hex");

export function encrypt(text) {
  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv(algorithm, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final()
  ]);

  const tag = cipher.getAuthTag();

  return {
    iv: iv.toString("hex"),
    data: encrypted.toString("hex"),
    tag: tag.toString("hex")
  };
}

export function decrypt(enc) {
  const iv = Buffer.from(enc.iv, "hex");
  const data = Buffer.from(enc.data, "hex");
  const tag = Buffer.from(enc.tag, "hex");

  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([
    decipher.update(data),
    decipher.final()
  ]);

  return decrypted.toString("utf8");
}