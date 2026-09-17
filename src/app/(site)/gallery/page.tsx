import type { Metadata } from "next";
import { GalleryGrid } from "@/components/GalleryGrid";
import { Container, LinkButton } from "@/components/ui";
import { getGalleryImages } from "@/lib/products";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Inside the Sweet Crust bakery in Kigali — the counter at opening, celebration cakes finished by hand, and pastries straight out of the oven.",
};

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <>
      {/* Top Hero Section - Light Mode Background & Dark Brown Text */}
      <section className="bg-cream-100 py-16 sm:py-20">
        <Container className="text-center">
          <p className="flourish font-script text-2xl font-bold text-gold-600 dark:text-gold-500">
            A Taste of Our Craft
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl text-gold-600 dark:text-gold-400">
            Inside Crème & Crumb
          </h1>
          <p  className="mx-auto mt-4 max-w-2xl text-base leading-relaxed sm:text-lg text-gold-600 dark:text-gold-400">
            Take a glimpse behind the scenes — from freshly baked pastries and delicate details to beautifully crafted cakes made for special moments.
          </p>
        </Container>
      </section>

      {/* Gallery Grid Section */}
      <section className="py-14 sm:py-20">
        <Container>
          <GalleryGrid
            images={images.map((i) => ({
              id: i.id,
              imageUrl: i.imageUrl,
              caption: i.caption,
              tag: i.tag,
            }))}
          />
        </Container>
      </section>

      {/* Bottom CTA Section - Light Mode Styling with Dark Brown Buttons */}
      <section className="bg-cream-100 py-16">
        <Container className="flex flex-col items-center gap-6 text-center ">
          <div>
            <p className="flourish font-script text-2xl font-bold text-gold-600 dark:text-gold-400">
              Inspired by Something?
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl text-gold-600 dark:text-gold-400">
              Turn Inspiration Into Something Delicious
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gold-600 dark:text-gold-400">
              Explore our collection of freshly baked treats, or work with us to create a custom cake made especially for your celebration.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <LinkButton 
              href="/patisseries" 
            >
              Patisserie Menu
            </LinkButton>
            <LinkButton 
              href="/custom-cakes" 
              variant="outline"
            >
              Explore Our Treats
            </LinkButton>
          </div>
        </Container>
      </section>
    </>
  );
}