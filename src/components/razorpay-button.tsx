
"use client";

import React, { useEffect, useRef } from 'react';

export function RazorpayButton() {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://checkout.razorpay.com/v1/payment-button.js";
    script.async = true;
    script.dataset.payment_button_id = "pl_RI06HY7Vu1skry";
    
    const currentFormRef = formRef.current;
    currentFormRef?.appendChild(script);

    return () => {
      if (currentFormRef?.contains(script)) {
        currentFormRef?.removeChild(script);
      }
    };
  }, []);

  return <form ref={formRef}></form>;
};
