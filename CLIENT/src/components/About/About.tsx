import React from 'react';

const About = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-10">About WishMe</h2>
        <div className="max-w-3xl mx-auto text-left">
          <p className="mb-6">
            WishMe is a platform that connects buyers and sellers in a seamless and efficient manner. Our goal is to
            bridge the gap between those who are looking for specific products and those who can provide them.
          </p>
          <p className="mb-6">
            With WishMe, buyers can post their requests, specify what they need, and sellers can respond accordingly,
            offering their products or services. Our integrated messaging system ensures clear communication and smooth
            transactions.
          </p>
          <p>
            Join WishMe today and experience a new way of finding what you need or reaching out to potential buyers.
            Let's make your wishes come true!
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
