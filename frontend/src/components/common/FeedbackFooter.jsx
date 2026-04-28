// src/components/common/FeedbackFooter.jsx
import React, { useState } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from '../../utils/toast';
import api from '../../utils/api'; // <-- IMPORT API
import { VALIDATION, SYSTEM_MESSAGES } from '../../utils/constants'; // <-- IMPORT KONSTANTA

export default function FeedbackFooter() {
  const { t } = useTranslation();
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanFeedback = feedback.trim();
    if (!cleanFeedback) return;

    if (cleanFeedback.length < VALIDATION.FEEDBACK.MIN_MESSAGE) {
      toast.error(`Feedback must be at least ${VALIDATION.FEEDBACK.MIN_MESSAGE} characters.`);
      return;
    }

    if (cleanFeedback.length > VALIDATION.FEEDBACK.MAX_MESSAGE) {
      toast.error(`Feedback must be max ${VALIDATION.FEEDBACK.MAX_MESSAGE} characters.`);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await api.feedback.send({ message: cleanFeedback });
      
      if (result.success) {
        toast.success(result.message);
        setFeedback('');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(SYSTEM_MESSAGES.NETWORK_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="w-full bg-[var(--card)] border-t border-[var(--border-strong)] mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-2 text-[var(--primary)]">
              <MessageSquare className="w-5 h-5" />
              <h3 className="font-bold tracking-tight">{t('feedback.title')}</h3>
            </div>
            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
              {t('feedback.desc')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full md:max-w-md flex flex-col sm:flex-row gap-2">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder={t('feedback.placeholder')}
              className="flex-1 min-h-[44px] max-h-[120px] bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all resize-none custom-scrollbar"
              required
              maxLength={VALIDATION.FEEDBACK.MAX_MESSAGE} // <-- TAMBAHKAN MAXLENGTH HTML
            />
            <button
              type="submit"
              disabled={isSubmitting || !feedback.trim()}
              className="h-11 px-6 bg-[var(--foreground)] text-[var(--background)] font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{t('feedback.btn')}</span>
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
}