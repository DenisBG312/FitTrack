import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen text-white">
      <div className="relative h-screen w-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source
            src="https://videos.pexels.com/video-files/3191289/3191289-uhd_2732_1440_25fps.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>

        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/80">
          <div className="flex h-full items-center justify-center">
            <div className="max-w-3xl px-6 text-center">
              <h1 className="font-heading text-5xl font-black tracking-tight text-white md:text-7xl">
                <span className="relative">
                  <span className="relative z-10">TRAIN HARD.</span>
                  <span className="absolute -bottom-1 left-0 h-3 w-full bg-yellow-500/30"></span>
                </span>{" "}
                <span className="text-yellow-500">STAY STRONG.</span>
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-gray-300 md:text-xl">
                Achieve your fitness goals with our all-in-one training and
                nutrition platform designed for athletes of all levels.
              </p>
              <div className="mt-10 flex justify-center space-x-4">
                <Link
                  to="/register"
                  className="transform rounded-lg bg-yellow-500 px-8 py-4 text-base font-bold text-gray-900 shadow-lg transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-yellow-400 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 sm:text-lg"
                >
                  GET STARTED
                </Link>
                <Link
                  to="/features"
                  className="rounded-lg border-2 border-white/30 bg-transparent px-8 py-4 text-base font-bold text-white transition duration-300 ease-in-out hover:border-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 sm:text-lg"
                >
                  LEARN MORE
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-yellow-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>

      <section className="relative bg-gray-900 py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 to-transparent h-32 pointer-events-none"></div>
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <span className="mb-4 inline-block rounded-full bg-yellow-500/20 px-4 py-1 text-sm font-semibold uppercase tracking-wider text-yellow-500">
              Why Choose FitTrack
            </span>
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
              <span className="text-white">Everything you need to </span>
              <span className="text-yellow-500">reach your goals</span>
            </h2>
            <div className="mx-auto mt-4 h-1 w-24 rounded bg-yellow-500"></div>
          </div>

          <div className="grid gap-10 md:grid-cols-3">
            {featuresData.map((feature, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl bg-gray-800 p-8 shadow-xl transition-all duration-300 hover:bg-gray-700 hover:shadow-2xl"
              >
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-lg bg-yellow-500/20 text-yellow-500">
                  {feature.icon}
                </div>
                <h3 className="mb-4 text-2xl font-bold">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
                <div className="mt-6">
                  <Link
                    to={feature.link}
                    className="inline-flex items-center font-semibold text-yellow-500 transition-colors hover:text-yellow-400"
                  >
                    Learn more
                    <svg
                      className="ml-2 h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      ></path>
                    </svg>
                  </Link>
                </div>
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-yellow-500/10 transition-transform duration-300 group-hover:scale-150"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-900 py-24">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <span className="mb-4 inline-block rounded-full bg-yellow-500/20 px-4 py-1 text-sm font-semibold uppercase tracking-wider text-yellow-500">
              Testimonials
            </span>
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
              <span className="text-white">What our </span>
              <span className="text-yellow-500">members say</span>
            </h2>
            <div className="mx-auto mt-4 h-1 w-24 rounded bg-yellow-500"></div>
          </div>

          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {testimonialData.map((testimonial, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-xl bg-gray-800 p-8 shadow-xl"
              >
                <div className="mb-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="h-5 w-5 text-yellow-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
                <p className="mb-6 text-lg italic text-gray-300">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center">
                  <div
                    className="mr-4 h-12 w-12 overflow-hidden rounded-full bg-cover bg-center"
                    style={{ backgroundColor: testimonial.avatarColor }}
                  >
                    <div className="flex h-full w-full items-center justify-center text-xl font-bold text-white">
                      {testimonial.name.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-400">
                      {testimonial.status}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-gray-900 py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-yellow-500/5 to-transparent"
            aria-hidden="true"
          ></div>
        </div>

        <div className="relative">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-4xl font-bold text-white md:text-5xl">
              Ready to transform your fitness journey?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-300">
              Join thousands of satisfied users who have achieved their fitness
              goals with FitTrack. Start your journey today.
            </p>
            <div className="mt-10">
              <Link
                to="/register"
                className="inline-flex items-center rounded-lg bg-yellow-500 px-8 py-4 text-lg font-bold text-gray-900 shadow-xl transition duration-300 ease-in-out hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
              >
                GET STARTED NOW
                <svg
                  className="ml-2 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  ></path>
                </svg>
              </Link>
            </div>
            <p className="mt-4 text-sm text-gray-400">
              No credit card required. 14-day free trial.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

const featuresData = [
  {
    title: "Workout Tracking",
    description:
      "Log and track your workouts with ease. Monitor sets, reps, weights, and rest periods to optimize your training.",
    link: "/workouts",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
  {
    title: "Nutrition Planning",
    description:
      "Stay on top of your diet with personalized meal plans. Track macros, calories, and nutrients for optimal results.",
    link: "/features/nutrition",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
  {
    title: "Progress Monitoring",
    description:
      "Set goals, track body metrics, and celebrate your gains. Visualize your progress with detailed charts and analytics.",
    link: "/features/progress",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
];

const testimonialData = [
  {
    name: "Alex G.",
    status: "Lost 30 lbs in 3 months",
    quote: "This app changed my fitness journey. The tracking features are intuitive and the meal plans are customized perfectly for my goals.",
    avatarColor: "#4F46E5",
  },
  {
    name: "Sarah W.",
    status: "Marathon Runner",
    quote: "Tracking workouts has never been this easy! I can see my progress week by week, which keeps me motivated to push harder.",
    avatarColor: "#0EA5E9",
  },
  {
    name: "Michael T.",
    status: "Bodybuilder",
    quote: "The nutrition tracking and workout planning have helped me prepare for competitions like never before. Definitely worth every penny!",
    avatarColor: "#10B981",
  },
];

export default Home;