import React, { useEffect, useState } from 'react';
import { FaqResponseDtoPagedResponse } from '../../api/api';
import faqPlus from '../../assets/images/faq-plus.png';
import Button from '../../components/Button';
import usersFaqService from '../../services/usersFaqService';
import './faq.scss';

const FAQ = () => {
  const [state, setState] = useState<{
    selected: number | null;
    faq: FaqResponseDtoPagedResponse;
    pending: boolean;
  }>({
    selected: null,
    faq: {},
    pending: true,
  });

  const loadFaq = (loadMore?: boolean) => {
    let page = state.faq?.page || 1;

    if (loadMore) {
      const nextPage = page + 1;

      if (nextPage <= (state.faq?.totalPages || 0)) {
        page = nextPage;
      } else {
        return;
      }
    }

    usersFaqService
      .get({
        page,
      })
      .then(
        (res) => {
          setState({
            ...state,
            pending: false,
            faq: {
              ...res,
              results:
                page > 1
                  ? [...(state.faq?.results || []), ...(res.results || [])]
                  : res.results,
            },
          });
        },
        () => {
          setState({
            ...state,
            pending: false,
          });
        }
      );
  };

  useEffect(() => {
    loadFaq();
  }, []);

  const onSelectSection = (selected: number) => {
    if (selected === state.selected) {
      setState({
        ...state,
        selected: null,
      });
    } else
      setState({
        ...state,
        selected,
      });
  };

  return (
    <div className="faq-page">
      {state.pending && <div className="spinner" />}
      {state.faq.results && (
        <div className="content-wrapper">
          {state.faq.results?.map((item, index) => {
            const selected = state.selected === index;
            return (
              <div
                key={item.id}
                className="section-wrapper"
                onClick={() => {
                  onSelectSection(index);
                }}
                role="presentation"
                onKeyDown={() => {}}
              >
                <div className="list-item-wrapper">
                  <div className="question-wrapper">
                    <span
                      className="question-title-text"
                      style={selected ? { color: '#FFAD01' } : {}}
                    >
                      {item.question}
                    </span>
                  </div>
                  {!selected && (
                    <button
                      type="button"
                      className="plus-img-wrapper"
                      onClick={() => {
                        onSelectSection(index);
                      }}
                    >
                      <img
                        src={faqPlus}
                        style={{ height: 28 }}
                        alt="Faq plus"
                      />
                    </button>
                  )}
                </div>

                {selected && (
                  <div className="answer-container">
                    <div
                      className="answer-text"
                      dangerouslySetInnerHTML={{
                        __html: item.answer || ' ',
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
          {(state.faq?.page || 0) < (state.faq?.totalPages || 0) && (
            <div className="d-flex justify-content-center">
              <Button
                title="Load more"
                onClick={() => loadFaq(true)}
                color="secondary"
                size="medium"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FAQ;
