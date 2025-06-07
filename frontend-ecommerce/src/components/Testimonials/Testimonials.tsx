import { useState, useEffect } from "react";
import { Carousel } from "react-bootstrap";
import styles from "./Testimonials.module.css";
import { GrLinkPrevious } from "react-icons/gr";
import { FaStar } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { GrLinkNext } from "react-icons/gr";

import Winnie from "../../assets/Winnie.jpg";
import Bethwel from "../../assets/Bethwel.jpg";
import Daisy from "../../assets/Daisy.jpg";

// Define the type for team member details
interface TeamMember {
  name: string;
  quote: string;
  rating: number;
  image: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Bethwel Kurgat",
    quote:
      "Shopping at Milliwin Boutique has been a game-changer! Their curated collection of high-end fashion is unmatched, and the personalized service made me feel like royalty. I found the perfect outfit for my event, and the quality is exceptional.",
    rating: 5,
    image: Bethwel,
  },
  {
    name: "Winnie N.K",
    quote:
      "Milliwin Boutique offers an exquisite shopping experience. The attention to detail in their designs and the seamless online ordering process blew me away. My order arrived quickly, beautifully packaged, and exceeded my expectations!",
    rating: 4.5,
    image: Winnie,
  },
  {
    name: "Daisy Chebet",
    quote:
      "Eric Adesh's data-driven methodologies have revolutionized our financial strategies. By integrating their insights, we've achieved a 20% reduction in unnecessary expenditures and enhanced our budget forecasting with unprecedented accuracy. Their dedication to understanding our unique needs while applying data science has been transformative.",
    rating: 4.5,
    image: Daisy,
  },
];

const Testimonials: React.FC = () => {
  const [index, setIndex] = useState<number>(0);

  const handleSelect = (selectedIndex: number) => {
    setIndex(selectedIndex);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % teamMembers.length);
    }, 5000); // 5 seconds
    return () => clearInterval(interval);
  }, []);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < Math.floor(rating)) {
        stars.push(<FaStar key={i} className={styles.starFilled} />);
      } else if (i < rating) {
        stars.push(<FaStar key={i} className={styles.starHalf} />);
      } else {
        stars.push(<FaStar key={i} className={styles.starEmpty} />);
      }
    }
    return stars;
  };

  return (
    <section className={styles.testimonials}>
      <h2 className={styles.testimonialTitle}>
        <FaPeopleGroup /> What Our Customers Say
      </h2>
      <p className={styles.description}>
        Hear from our valued customers about their luxurious shopping
        experiences with Milliwin Online Boutique.
      </p>
      <div className={styles.carouselContainer}>
        <Carousel
          activeIndex={index}
          onSelect={handleSelect}
          controls={false}
          indicators={false}
          interval={5000}
          wrap={true}
          className={styles.carousel}
        >
          {teamMembers.map((member, idx) => (
            <Carousel.Item key={idx}>
              <div className={styles.card}>
                <div>
                  <img
                    src={member.image}
                    alt={`${member.name}-img`}
                    className={`rounded-circle ${styles.img}`}
                  />
                </div>
                <div className={styles.details}>
                  <h5 className={styles.names}>{member.name}</h5>
                  <p className={styles.testimonialText}>
                    <span>{member.quote}</span>
                  </p>
                  <div className={styles.ratings}>
                    {renderStars(member.rating)}
                  </div>
                </div>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
        <button
          className={`${styles.carouselButton} ${styles.prevButton}`}
          onClick={() =>
            setIndex(
              (prevIndex) =>
                (prevIndex - 1 + teamMembers.length) % teamMembers.length
            )
          }
        >
          <GrLinkPrevious />
        </button>
        <button
          className={`${styles.carouselButton} ${styles.nextButton}`}
          onClick={() =>
            setIndex((prevIndex) => (prevIndex + 1) % teamMembers.length)
          }
        >
          <GrLinkNext />
        </button>
      </div>
    </section>
  );
};

export default Testimonials;
