import Image from 'next/image';

const SelectPack = ({ packs, selected, setSelected, isOpen, setIsOpen }) => {
  return (
    <div className="custom-select">
      <button className="select-btn" onClick={() => setIsOpen(!isOpen)}>
        {selected.img && (
          <Image
            src={selected.img}
            layout="intrinsic"
            width={150}
            height={75}
            alt={selected.label}
          />
        )}
      </button>
      {isOpen && (
        <ul className="select-dropdown">
          {packs.map((pack) => (
            <li
              key={pack.value}
              className="select-option"
              onClick={() => {
                setSelected(pack);
                setIsOpen(false);
              }}
            >
              {pack.img && (
                <div className='imgBox'>
                  <Image src={pack.img} width={100} height={20} alt={pack.label} />
                </div>
              )}
              <span className="label">{pack.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SelectPack;
