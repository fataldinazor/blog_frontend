import { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { fetchHomepageArticles } from "../../api/homepage";
import { Link } from "react-router-dom";
import { BlogIcon } from "@/assets/Icons";
import { Loading } from "../Loading";

export function CarouselSize() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const posts = await fetchHomepageArticles();
        setArticles(posts);
      } catch (error) {
        console.log(`Couldn't fetch articles ${error}`);
      } finally {
        setIsLoading(false);
      }
    };
    // setIsLoading(true);
    // setTimeout(() => {
      fetchData();
    // }, 5000);
  }, []);

  if (isLoading) {
    return <Loading color="white" height="50" width="50"/>;
  }

  return (
    <Carousel className="w-2/3 max-w-sm md:max-w-screen-md lg:max-w-screen-lg">
      <CarouselContent className="-ml-1">
        {articles.map((article, index) => (
          <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <Card>
                <CardContent
                  className="relative flex aspect-square rounded-xl items-center justify-center p-6 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${article.image_url})`,
                  }}
                >
                  <div className="absolute inset-0 rounded-xl bg-black bg-opacity-30"></div>
                  <div className="absolute bottom-0 rounded-xl left-0 w-full bg-black bg-opacity-60 text-white p-2">
                    <h2 className="text-sm md:text-base font-semibold truncate ...">
                      {article.title}
                    </h2>
                    <Link
                      to={`/articles/${article.id}`}
                      className="text-sm font-semibold text-white hover:underline"
                    >
                      Read More →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="bg-black"></CarouselPrevious>
      <CarouselNext className="bg-black"></CarouselNext>
    </Carousel>
  );
}

const HeroSection = () => {
  return (
    <section className="flex flex-col h-full items-center justify-center bg-black text-white overflow-hidden relative">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover"
        style={{
          backgroundImage: `url('https://res.cloudinary.com/dafr5o0f3/image/upload/v1734104563/oybaylem9u0ig2iixvlv.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
      </div>

      <div className="relative z-10 flex flex-col justify-center items-center sm:gap-10 md:gap-3">
        <div className="lg:hidden pb-5">
          <BlogIcon color="white" height="50" width="50" />
        </div>
        <div className="relative z-10 text-center px-10 md:max-w-screen-md lg:max-w-screen-lg">
          <h1 className="text-3xl md:text-5xl font-bold tracking-widest mb-4 animate__animated animate__fadeIn animate__delay-1s">
            Curating Thoughts, Shaping Futures
          </h1>
          <p className="text-sm md:text-xl mb-6 opacity-80 animate__animated animate__fadeIn animate__delay-2s">
            Stay updated with the latest trends, insights, and tips from the
            world of technology, development, and more.
          </p>
          <Link
            to="/articles"
            className="inline-block px-4 py-3 text-sm md:text-lg md:px-8 bg-white text-black font-semibold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 animate__animated animate__fadeIn animate__delay-3s"
          >
            Explore Articles
          </Link>
        </div>
      </div>

      <div className="relative z-10 w-full mt-8 md:mt-12 text-white">
        <div className="px-4 sm:px-8 md:px-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-4 md:mb-8">
            Featured Articles
          </h2>
          <div className="m-2 flex justify-center rounded-md">
            <CarouselSize />
          </div>
        </div>
      </div>
    </section>
  );
};

const Homepage = () => {
  return (
    <div className="h-full flex flex-col">
      <HeroSection />
    </div>
  );
};

export default Homepage;
