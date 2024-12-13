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

const HeroSection = () => {
  return (
    <section className="flex items-center justify-center h-screen bg-black text-white overflow-hidden relative">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/path-to-your-image.jpg)" }}
      ></div>

      <div className="relative z-10 text-center px-6 md:px-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-widest mb-4 animate__animated animate__fadeIn animate__delay-1s">
          Welcome to Your Future
        </h1>
        <p className="text-lg md:text-xl mb-6 opacity-80 animate__animated animate__fadeIn animate__delay-2s">
          Discover endless possibilities with our services.
        </p>
        <a
          href="#explore"
          className="inline-block px-8 py-3 text-lg bg-white text-black font-semibold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 animate__animated animate__fadeIn animate__delay-3s"
        >
          Explore Now
        </a>
      </div>
    </section>
  );
};

export function CarouselSize({ articles }) {
  return (
    <Carousel className="w-2/3 max-w-sm md:max-w-screen-md lg:max-w-screen-lg">
      <CarouselContent className="-ml-1">
        {articles.map((article, index) => (
          <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <Card>
                <CardContent
                  className="relative flex aspect-square rounded-md items-center justify-center p-6 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${article.image_url})`,
                  }}
                >
                  <div className="absolute inset-0 rounded-md bg-black bg-opacity-30"></div>
                  <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-60 text-white p-2">
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
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

function Homepage() {
  const [articles, setArticles] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const posts = await fetchHomepageArticles();
        console.log(posts);
        setArticles(posts);
        setIsLoading(false);
      } catch (error) {
        console.log(`Couldn't fetch articles ${error}`);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col justify-between">
      {/* <section className="bg-[url(https://img.freepik.com/free-photo/medium-shot-man-wearing-vr-glasses_23-2149126949.jpg?t=st=1733844896~exp=1733848496~hmac=df0cb4311a981e6e5dee1dc053377e48f26d52683a260a25a309b1f6c28a18b6&w=1380)] bg-cover bg-center bg-no-repeat lg:bg-top">
        <div className="bg-black/50 h-[300px] md:h-[400px] lg:h-[450px] px-6 sm:px-12 md:px-16 py-16 md:py-20">
          <div className="flex flex-col items-start">
            <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              Latest Blogs
            </h2>
            <p className="hidden max-w-lg text-white/90 md:mt-6 md:block md:text-base md:leading-normal lg:text-lg lg:leading-relaxed">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Inventore officia corporis quasi doloribus iure architecto quae
              voluptatum beatae excepturi dolores.
            </p>
            <div className="mt-4 sm:mt-8">
              <Link
                to="/articles"
                className="inline-block py-2 px-4 bg-purple-950 text-white font-semibold rounded-lg hover:bg-purple-700 transition duration-300"
              >
                Explore
              </Link>
            </div>
          </div>
        </div>
      </section> */}
      <HeroSection />
      <div className="flex flex-col gap-5 my-5">
        <h1 className="font-bold md:font-bold text-center text-2xl md:text-2xl lg:text-4xl">
          Explore a Range of Articles
        </h1>
        <div className="px-4 sm:px-8 md:px-12 flex justify-center">
          {articles && <CarouselSize articles={articles} />}
        </div>
      </div>
    </div>
  );
}

export default Homepage;
