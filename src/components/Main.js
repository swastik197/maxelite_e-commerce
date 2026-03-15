import React from 'react';

const InteriorCard = () => {
    // Define colors to match the image
    const cardColor = 'bg-[#0f3c4c]'; // Deep Teal
    const cardColorHex = '#001e3a';   // For use in arbitrary shadow values
    const bgColor = 'bg-[#BDD8E9]';
    const bgColorHex = '#BDD8E9';

    return (
        <div className={`min-h-screen ${bgColor} border-white flex items-center justify-center pb-6`}>

            {/* MAIN CARD CONTAINER 
        We use 'relative' to position the tabs and cutouts absolutely.
      */}
            <div className={`relative w-full max-w-screen h-screen ${cardColor} rounded-[40px] rounded-tl-none flex overflow-visible`}
                 style={{
                   backgroundImage: "url('/main.png')",
                   backgroundSize: 'cover',
                   backgroundPosition: 'center',
                   backgroundRepeat: 'no-repeat'
                 }}>

                {/* C:\Users\user\Desktop\maxelite_ecommerce\public\==============================
            1. TOP LEFT TAB SYSTEM
           ============================== */}

                {/* The Tab Itself */}
                <div className={`relative w-64 h-16 ${bgColor} rounded-br-[30px] `}>
                   <div className="  w-16 h-16 pointer-events-none overflow-hidden">

                        <div
                            className={`absolute top-[64] w-3/4 h-1/2 border-0 ${bgColor} rounded-br-[-30px]`}
                           >
                            <div
                                className={`w-auto h-full border-0  bg-[#001e3a] rounded-tl-[30px]`}
                               ></div>
                        </div>
                    </div>
                    
                </div>

                {/* The "Scoop" (Inverted Radius) connecting Tab to Card Body */}
                <div className="  w-16 h-16 pointer-events-none overflow-hidden">
                    {/* Logic: A transparent box with a rounded BOTTOM-LEFT corner.
            The Shadow matches the card color and is cast down and left 
            to fill the empty space, creating a concave curve.
          */}
                    <div
                        className={`w-3/4 h-1/2 border-0 ${bgColor} rounded-br-[-30px]`}
                        style={{ boxShadow: `-40px 40px 0 0 ${cardColorHex}` }}>
                        <div
                            className={`w-full h-full border-0  bg-[#001e3a] rounded-tl-[30px]`}
                            ></div>
                    </div>
                </div>


                {/* ==============================
            2. BOTTOM RIGHT CUTOUT SYSTEM
           ============================== */}

                {/* The "Hole" (White "Hill" blocking the card) */}
                <div className={`absolute -bottom-1 right-24 w-40 h-24 ${bgColor} rounded-t-full z-10`}></div>

                {/* Left Smooth Connector for the Hole */}
                <div className="absolute bottom-0 right-[16rem] w-12 h-12 z-10">
                    <div
                        className="w-full h-full bg-transparent rounded-br-[25px]"
                        style={{ boxShadow: `25px 25px 0 0 ${bgColorHex}` }}
                    />
                </div>

                {/* Right Smooth Connector for the Hole */}
                <div className="absolute bottom-0 right-12 w-12 h-12 z-10">
                    <div
                        className="w-full h-full bg-transparent rounded-bl-[25px]"
                        style={{ boxShadow: `-25px 25px 0 0 ${bgColorHex}` }}
                    />
                </div>


                {/* ==============================
            3. CARD CONTENT
           ============================== */}
                <div className="w-full h-full relative z-0 flex flex-col items-center justify-center p-12 text-center">

                    {/* Text Content */}
                    <div className="mb-8 z-10 relative">
                        <h1 className="text-4xl sm:text-6xl md:text-8xl text-white font-light mb-2">
                            Discover Your Perfect
                        </h1>
                        <h1 className="text-4xl sm:text-6xl md:text-8xl text-white font-medium">
                            Space
                        </h1>
                    </div>

                    {/* Image */}
                    {/* Using a mix-blend-mode or opacity can help integrate the image 
             if you want the background color to tint it, but here we just 
             display it cleanly with rounded corners.
          */}
                    <div className="relative w-full h-64 md:h-80 rounded-3xl overflow-hidden shadow-inner">
                       
                    </div>

                </div>

            </div>
        </div>
    );
};

export default InteriorCard;

