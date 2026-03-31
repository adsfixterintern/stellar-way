import { Mail, PhoneCall } from 'lucide-react';

const Contact = () => {

  const mapSource = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117822.4277432367!2d90.28312061486717!3d22.692881699946405!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x37553407f354ab4f%3A0x29651ed039fca600!2sBarishal!5e0!3m2!1sen!2sbd!4v1711364500000!5m2!1sen!2sbd";

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Content */}
        <div className="space-y-6 lg:col-span-5">
          <p className="superTitle">
            Contact
          </p>
          <h2 className="secTitle">
            Let&apos;s Talk With Us
          </h2>
          <p className="description">
            Whether you&apos;re looking to schedule a service appointment, request a quote, or inquire about our services, we&apos;re ready to assist you.
          </p>

          <div className="space-y-5 pt-4">
            {/* Phone Number */}
            <div className="flex items-center gap-4 group">
              <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white transition-transform group-hover:scale-110 shadow-lg">
                <PhoneCall size={22} />
              </div>
              <span className="text-[18px] text-black font-medium">+1-555-123-4567</span>
            </div>

            {/* Email Address */}
            <div className="flex items-center gap-4 group">
              <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white transition-transform group-hover:scale-110 shadow-lg">
                <Mail size={22} />
              </div>
              <span className="text-[18px] text-black font-medium">support@dinedivine.com</span>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="lg:col-span-7 h-112 w-full rounded-2xl overflow-hidden ">
          <iframe
            src={mapSource}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="grayscale-[0.2] contrast-[1.1] hover:grayscale-0 transition-all duration-500"
          ></iframe>
        </div>

      </div>
    </section>
  );
};

export default Contact;

