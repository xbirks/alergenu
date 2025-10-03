'use client';

import { useState } from 'react';
import Image from 'next/image';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqProps {
  data: FaqItem[];
}

export function Faq({ data }: FaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full max-w-2xl mx-auto mt-28 container px-4">
      <div className="text-left mb-12">
        <h2 className="text-[32px] font-extrabold tracking-tight">Preguntas frecuentes</h2>
      </div>

      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="bg-[#F2F2F2] rounded-2xl p-6 cursor-pointer" onClick={() => toggleFaq(index)}>
            <div className="flex justify-between items-start gap-4">
              <h3 className="text-lg font-semibold tracking-tight text-gray-900">{item.question}</h3>
              <div className={`relative flex-shrink-0 w-5 h-5 mt-1 transform transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                <Image src="/icons/web_icons/arrow_faq.svg" alt="Toggle FAQ" layout="fill" />
              </div>
            </div>
            {openIndex === index && (
              <div className="mt-4 pr-10">
                <p className="text-gray-700 leading-relaxed">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
