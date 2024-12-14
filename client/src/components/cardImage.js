import React, { useState, useEffect } from 'react';
import Image from 'react-bootstrap/Image';

const CardImage = ({ card, className, handleClick }) => {
  const [imageSrc, setImageSrc] = useState(null);

  useEffect( () => {
      setImageSrc(`/cards/en_US/${card.version}/${card.dbfId}.png`);
  }, [card]);

  if(handleClick === undefined) {
    return (
      // <img
      //   src={imageSrc}
      //   onError={(e)=>{e.target.onError = null; e.target.src = "/icons/placeholder.png"}}
      //   alt={card.name}
      //   className={className}
      // />
      <Image src={`${imageSrc}`} fluid rounded alt={card.name} className={className} />
    );
  }
  return (
    // <img
    //   src={imageSrc}
    //   onError={(e)=>{e.target.onError = null; e.target.src = "/icons/placeholder.png"}}
    //   alt={card.name}
    //   className={className}
    //   onClick={() => handleClick(card)}
    //   style={{ cursor: "pointer" }}
    // />
    <Image 
      src={`${imageSrc}`} 
      fluid
      rounded 
      alt={card.name}
      onClick={() => handleClick(card)}
      style={{ cursor: "pointer"}}
      className={className}
      />
  );
};

export default CardImage;



// following snippet kinda used to work, and it was in the CardImage function

  // const generatePlaceholderImage = async (card) => {

  //   let infoForBody = { version: card.version, dbfId: card.dbfId };

  //   try {
  //     const response = await fetch('http://localhost:5000/generate-placeholder', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify(infoForBody)
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to generate placeholder image');
  //     }
  
  //     // Handle response data if necessary
  //     const data = await response.json();
  //     console.log('Placeholder image generated:', data);

  //     return `/placeholder/enUS/${card.version}/${card.dbfId}.png`;
  //     // setImageSrc(`/placeholder/enUS/${card.version}/${card.dbfId}.png`);
  //   } catch (error) {
  //     console.error('Error generating placeholder image:', error);
  //   }

    
  // };

  // useEffect(() => {
  //   const cardSrc = `/cards/en_US/${card.version}/${card.dbfId}.png`;
  //   const placeholderSrc = `/placeholder/enUS/${card.version}/${card.dbfId}.png`;
  //   fetch(cardSrc)
  //       .then(response => {
  //           if(response.ok && response.headers.get('Content-Type').startsWith('image/')) {
  //               // console.log("Card image exists.");
  //               setImageSrc(cardSrc);
  //           } else {
  //               // console.log("Card image does not exist. Fetching placeholder...");
  //               fetch(placeholderSrc)
  //                   .then(response2 => {
  //                       if(!(response2.ok && response2.headers.get('Content-Type').startsWith('image/'))){
  //                           // generatePlaceholderImage(card).then(res => {
  //                           //   setImageSrc(res);
  //                           // });
  //                       } else {
  //                           setImageSrc(placeholderSrc);
  //                       }
  //                   });
  //           }
  //       }).catch( error => {
  //           console.error("Error fetching card image:", error);
  //       });
  // }, [card]);