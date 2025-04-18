// 'use client';

// import React from 'react';
// import { DynamicSection } from '@/lib/business/domain-utils';// Assuming usage of shadcn/ui
// import { ThemeDefinition, ThemeColors } from '../../_themes/themeConfig';

// interface TextCardsSectionProps {
//   section: DynamicSection;
//   theme: ThemeDefinition;
//   colors: ThemeColors;
// }


// // Basic component to render text cards
// export default function TextCardsSection({ section, theme, colors }: TextCardsSectionProps) {
//   // Pre-compute styles based on theme
//   const cardStyle = {
//     background: theme.cardStyles.background(colors),
//     border: theme.cardStyles.border(colors),
//     boxShadow: theme.cardStyles.boxShadow(colors),
//     color: theme.cardStyles.textColor(colors),
//     borderRadius: theme.cardStyles.borderRadius || '16px',
//   };

//   const sectionStyle = {
//     background: theme.cardStyles.background(colors),
//     color: theme.cardStyles.textColor(colors),
//   };

//   return (
//     <section className="py-16" style={sectionStyle}>
//       <div className="container mx-auto px-4">
//         {section.content.title && (
//           <h2 
//             className="text-3xl font-bold text-center mb-12"
//             style={{ color: theme.featureSectionStyles?.titleColor(colors) || colors.primary }}
//           >
//             {section.content?.title}
//           </h2>
//         )}
        
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {section.content.cards?.map((card, index) => (
//             <div 
//               key={index}
//               className="p-6 transition-all hover:shadow-xl hover:-translate-y-1"
//               style={cardStyle}
//             >
//               {card.title && (
//                 <h3 
//                   className="text-xl font-bold mb-4"
//                   style={{ color: theme.featureSectionStyles?.cardTitleColor(colors, index) || colors.primary }}
//                 >
//                   {card.title}
//                 </h3>
//               )}
//               {card.content && (
//                 <div 
//                   className="prose max-w-none"
//                   style={{ color: theme.featureSectionStyles?.cardTextColor(colors) || colors.text }}
//                   dangerouslySetInnerHTML={{ __html: card.content }}
//                 />
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// } 