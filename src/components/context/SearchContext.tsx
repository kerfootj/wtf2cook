import { ReactNode, createContext, useContext, useState } from 'react';

type SearchContext = {
    search: string;
    setSearch: (search: string) => void;
};

/**
 * Context for the recipe search input
 */
const SearchContext = createContext<SearchContext>({
    search: '',
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setSearch: () => {},
});
SearchContext.displayName = 'SearchContext';

/**
 * Hook for accessing the search context
 * @returns the search context
 */
export function useSearch() {
    return useContext(SearchContext);
}

type SearchContextProviderProps = {
    children: ReactNode;
};

/**
 * Context provider for the recipe search input
 * - maintains the search state
 * @param props.children - the children of the provider
 */
export function SearchContextProvider(props: SearchContextProviderProps) {
    const [search, setSearch] = useState('');

    return (
        <SearchContext.Provider value={{ search, setSearch }}>
            {props.children}
        </SearchContext.Provider>
    );
}
