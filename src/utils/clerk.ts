import {createClerkClient, StrictAuthProp} from "@clerk/clerk-sdk-node";

export const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY
})

declare global {
  namespace Express {
    interface Request extends StrictAuthProp {}
  }
}