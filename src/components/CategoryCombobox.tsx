import { useState, useRef, useEffect } from "react";
import { ChevronDown, Plus, Check } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

interface CategoryComboboxProps {
  value: string;
  onChange: (value: string) => void;
  categories: string[];
  onAddCategory?: (category: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
}

export function CategoryCombobox({ 
  value, 
  onChange, 
  categories, 
  onAddCategory,
  placeholder = "Sélectionner ou ajouter une catégorie",
  label = "Catégorie",
  required = false
}: CategoryComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [filteredCategories, setFilteredCategories] = useState(categories);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filtrer les catégories selon la saisie
  useEffect(() => {
    if (inputValue) {
      const filtered = categories.filter(category =>
        category.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categories);
    }
  }, [inputValue, categories]);

  // Mettre à jour l'input quand la valeur change de l'extérieur
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Mettre à jour les catégories filtrées quand les catégories changent
  useEffect(() => {
    setFilteredCategories(categories);
  }, [categories]);

  // Fermer la dropdown si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    // Si l'input est vide, afficher toutes les catégories
    if (!inputValue) {
      setFilteredCategories(categories);
    }
  };

  const handleCategorySelect = (category: string) => {
    if (category === "Autres") {
      setShowAddForm(true);
      setNewCategoryName("");
    } else {
      setInputValue(category);
      onChange(category);
      setIsOpen(false);
      inputRef.current?.focus();
    }
  };

  const handleAddNewCategory = () => {
    if (newCategoryName.trim() && onAddCategory) {
      onAddCategory(newCategoryName.trim());
      setShowAddForm(false);
      setNewCategoryName("");
      // Ouvrir le dropdown pour montrer la nouvelle catégorie ajoutée
      setIsOpen(true);
    }
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
    setNewCategoryName("");
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCategories.length > 0 && inputValue.toLowerCase() === filteredCategories[0].toLowerCase()) {
        handleCategorySelect(filteredCategories[0]);
      } else {
        setIsOpen(false);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  const isNewCategory = inputValue && !categories.some(cat => 
    cat.toLowerCase() === inputValue.toLowerCase()
  );

  return (
    <div className="space-y-3">
      <Label className="text-gray-900">
        {label} {required}
      </Label>
      
      <div className="relative">
        {/* Input principal */}
        <div className="relative">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="rounded-xl pr-10"
          />
          <button
            type="button"
            onClick={() => {
              setIsOpen(!isOpen);
              // Si on ouvre le dropdown et l'input est vide, afficher toutes les catégories
              if (!isOpen && !inputValue) {
                setFilteredCategories(categories);
              }
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Dropdown */}
        {isOpen && !showAddForm && (
          <div 
            ref={dropdownRef}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
          >
            <div className="py-2">
              {/* Affichage des catégories (filtrées ou complètes) */}
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleCategorySelect(category)}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between group transition-colors ${
                      category === "Autres" ? "border-t border-gray-100" : ""
                    }`}
                  >
                    <span className={`${category === "Autres" ? "text-blue-600 font-medium" : "text-gray-900"}`}>
                      {category === "Autres" ? (
                        <div className="flex items-center space-x-2">
                          <Plus className="w-4 h-4" />
                          <span>{category}</span>
                        </div>
                      ) : (
                        category
                      )}
                    </span>
                    {inputValue.toLowerCase() === category.toLowerCase() && category !== "Autres" && (
                      <Check className="w-4 h-4 text-blue-600" />
                    )}
                  </button>
                ))
              ) : (
                <div className="py-4 px-4 text-center text-gray-500">
                  Aucune catégorie trouvée
                </div>
              )}

              {/* Nouvelle catégorie */}
              {isNewCategory && (
                <>
                  {filteredCategories.length > 0 && (
                    <div className="border-t border-gray-100"></div>
                  )}
                  <button
                    type="button"
                    onClick={() => handleCategorySelect(inputValue)}
                    className="w-full px-4 py-2 text-left hover:bg-blue-50 flex items-center space-x-2 group transition-colors"
                  >
                    <Plus className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-600 font-medium">
                      Créer "{inputValue}"
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Formulaire d'ajout de nouvelle catégorie */}
        {showAddForm && (
          <div 
            ref={dropdownRef}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg p-4"
          >
            <div className="space-y-3">
              <div>
                <Label className="text-gray-900 text-sm font-medium">
                  Nouvelle catégorie
                </Label>
                <Input
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Nom de la nouvelle catégorie"
                  className="rounded-xl mt-1"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddNewCategory();
                    } else if (e.key === 'Escape') {
                      handleCancelAdd();
                    }
                  }}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCancelAdd}
                  className="rounded-xl"
                >
                  Annuler
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddNewCategory}
                  disabled={!newCategoryName.trim()}
                  className="rounded-xl bg-blue-600 hover:bg-blue-700"
                >
                  Ajouter
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Indicateur de nouvelle catégorie */}
      {isNewCategory && (
        <div className="flex items-center space-x-2 text-sm text-blue-600">
          <Plus className="w-3 h-3" />
          <span>Nouvelle catégorie sera créée</span>
        </div>
      )}
    </div>
  );
}