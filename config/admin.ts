export default ({ env }) => ({
  auth: {
    secret: env("ADMIN_JWT_SECRET", "defaultAdminJWTSecret"),
  },
  apiToken: {
    salt: env("API_TOKEN_SALT", "defaultApiTokenSalt"),
  },
  transfer: {
    token: {
      salt: env("TRANSFER_TOKEN_SALT", "defaultTransferTokenSalt"),
    },
  },
  secrets: {
    encryptionKey: env("ENCRYPTION_KEY", "defaultEncryptionKey"),
  },
  flags: {
    nps: env.bool("FLAG_NPS", true),
    promoteEE: env.bool("FLAG_PROMOTE_EE", true),
  },
});
