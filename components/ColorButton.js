import React from 'react';
import colorConfig from '../theme/config';

const ColorButton = ({ color, onClick, selectedColor }) => {

  const colorClass = colorConfig[color];
  const isSelected = selectedColor === color;


  const capitalizedColor = (color) => {
    return color.charAt(0).toUpperCase() + color.slice(1);
  }

  return (
    <button
      onClick={() => onClick(color)}
      type="button"
      className={`color flex w-[120px] justify-center text-gray-900 bg-white focus:outline-none hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 border ${isSelected ? colorClass.border : 'border-gray-300'}`}
    >
      <div
        className={`color-display h-4 w-4 mr-2 ${colorClass.bg}`}
      ></div>
      {capitalizedColor(color)}
    </button>
  );
};

export default ColorButton;