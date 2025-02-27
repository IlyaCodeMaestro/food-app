import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "tbrctr9r",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-02-26",
  token:
    process.env.SANITY_API_TOKEN ||
    "skL86jOpT2INKDJipXHjtLFw3UhfVMBTMYWdKz3rhwi3hIGcUr8zff0LIBSWDunolBiAx0jm1vWb0befDiaBYBWKDdIdfCtUCBl9DyVQc9YOTqDF5Foo2XyvxPzF4VO4nf4sPeJqMB76qV8LXTYB1cUo3f2ETE1KIz8spYBJo0PXnXVIbm3s",
  useCdn: false,
});

const builder = imageUrlBuilder(client);

export const urlFor = (source: any) => builder.image(source);
