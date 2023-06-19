import { Search } from '@mui/icons-material';
import {
    IconButton,
    InputAdornment,
    OutlinedInput,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { useState } from 'react';
import { useSearch } from '../context/SearchContext';

export function SearchBar() {
    const theme = useTheme();
    const is_small = useMediaQuery(theme.breakpoints.down('sm'));

    const { setSearch } = useSearch();
    const [value, setValue] = useState('');

    const handleSearch = () => {
        setSearch(value);
    };

    return (
        <OutlinedInput
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    handleSearch();
                }
            }}
            placeholder={'Search' + (is_small ? '' : ' Recipes')}
            endAdornment={
                <InputAdornment position="end">
                    <IconButton onClick={handleSearch}>
                        <Search />
                    </IconButton>
                </InputAdornment>
            }
            sx={{
                flex: 1,
                fontFamily: 'Inter',
                background: theme.palette.grey['900'],
                height: 48,
            }}
        />
    );
}
