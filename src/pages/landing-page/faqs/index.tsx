import Accordion from "./accordion";
import { faqs } from "./data";

const FAQs = () => {
  return (
    <div>
      <h1>Frequently Asked Questions</h1>
      <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-y-0 gap-x-8">
        {faqs.map(({ qn, answer }, index) => (
          <li key={index}>
            <Accordion
              title={
                <span className="inline-flex gap-3">
                  <span>{index + 1}.</span>
                  <span>{qn}</span>
                </span>
              }
            >
              <p>{answer}</p>
            </Accordion>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FAQs;
