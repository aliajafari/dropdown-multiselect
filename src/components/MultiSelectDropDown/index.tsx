import React, { useState, useRef, useEffect, useMemo } from "react";
import styles from "./MultiSelectDropdown.module.scss";

interface Option {
  label: string;
  id: string;
}

interface MultiSelectDropdownProps {
  options: Option[];
  onSelect: (selected: Option[]) => void;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  onSelect,
}) => {
  const [availableOptions, setAvailableOptions] = useState<Option[]>(options);
  const [selected, setSelected] = useState<Option[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handleToggleOption = (option: Option) => {
    let updatedSelected;
    if (selected.some((item) => item.label === option.label)) {
      updatedSelected = selected.filter((item) => item.label !== option.label);
    } else {
      updatedSelected = [...selected, option];
    }
    setSelected(updatedSelected);
    onSelect(updatedSelected);
  };

  const handleAddNewOption = () => {
    if (
      searchValue.trim() !== "" &&
      !availableOptions.some((item) => item.label === searchValue)
    ) {
      const newItem: Option = {
        label: searchValue,
        id: Math.floor(Math.random() * 26).toString(),
      };
      const updatedOptions = [...availableOptions, newItem];
      setAvailableOptions(updatedOptions);
      handleToggleOption(newItem);
      setSearchValue("");
    }
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      wrapperRef.current &&
      !wrapperRef.current.contains(event.target as Node)
    ) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const filteredOptions = useMemo(
    () =>
      availableOptions.filter((option) =>
        option.label.toLowerCase().includes(searchValue.toLowerCase())
      ),
    [availableOptions, searchValue]
  );

  return (
    <div className={styles.multiSelectDropdown} ref={wrapperRef}>
      <div className={styles.dropdownHeader}>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAddNewOption();
          }}
          placeholder="Type to search or add..."
          onClick={toggleDropdown}
        />
        <span className={styles.arrow} onClick={toggleDropdown}>
          {dropdownOpen ? "▲" : "▼"}
        </span>
      </div>
      {dropdownOpen && (
        <div className={styles.dropdownBody}>
          {!availableOptions.length && (
            <div className={styles.dropdownLabelEmpty}>
              Please Add an Option
            </div>
          )}
          <ul>
            {filteredOptions.map((option, index) => (
              <li
                key={index}
                className={
                  selected.some((item) => item.label === option.label)
                    ? styles.selected
                    : ""
                }
                onClick={() => handleToggleOption(option)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
