import { Box, MenuItem, Select, TablePaginationProps } from "@mui/material";
import { GridPagination, gridPageCountSelector, useGridApiContext, useGridSelector } from "@mui/x-data-grid";
import { ActionButton } from "../Buttons/ActionButton";
import './CustomPagination.scss'

function serverSidePagination({
    page,
    onPageChange,
    className,
  }: Pick<TablePaginationProps, 'page' | 'onPageChange' | 'className'>) {
    
    const apiRef = useGridApiContext();
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);
    const handlePageChange = (event : any) => {
        const newPage = event.target.value as number;
        onPageChange(event, newPage - 1);
    };

    if ( pageCount <= 1){
        return <></>
    }
    
    return (
        <>
            <Box  className="custom-pagination">

                <Box className='pagination-container' display={{md:'flex',xs:'none'}}>
                    <Box className='pagination-action-container' display={'flex'}>
                        <ActionButton 
                            color='warning'
                            icon='keyboard_double_arrow_left'
                            text="Prima"
                            onClick={(event) => onPageChange(event, page = 0)}
                            disabled={page === 0} 
                            direction={'row-reverse'} 
                        />
                        <ActionButton
                                color='primary'
                                icon='chevron_left'
                                text="Precedente"
                                onClick={(event) => onPageChange(event, page - 1)}
                                disabled={page === 0} 
                                direction={'row-reverse'}
                        />
                    </Box>
                
                
                    <Select
                        color="primary"
                        size="small"
                        value={page + 1}
                        onChange={handlePageChange}
                        className='my_select-pages'
                        >
                        {[...Array(pageCount).keys()].map((index) => (
                            <MenuItem key={index + 1} value={index + 1}>
                            {index + 1}
                            </MenuItem>
                        ))}
                    </Select>
            
                    <Box className='pagination-action-container' display={'flex'} >
                        <ActionButton
                            color='primary'
                            text="Successiva"
                            icon='chevron_right'
                            onClick={(event) => onPageChange(event, page + 1)}
                            disabled={page === pageCount - 1}
                        />
                        <ActionButton
                            color='warning'
                            text="Ultima"
                            icon='keyboard_double_arrow_right'
                            onClick={(event) => onPageChange(event, pageCount - 1)}
                            disabled={page === pageCount - 1}
                        />
        
                    </Box>
                </Box>


                <Box className='pagination-container' display={{md:'none',xs:'flex'}} width={'100%'}>
                    <Select
                        color="primary"
                        size="small"
                        value={page + 1}
                        onChange={handlePageChange}
                        className='my_select-pages'
                        >
                        {[...Array(pageCount).keys()].map((index) => (
                            <MenuItem key={index + 1} value={index + 1}>
                            {index + 1}
                            </MenuItem>
                        ))}
                    </Select>
            
                    <Box  className='pagination-action-container' display={'flex'} >
                        
                        <ActionButton
                            color='primary'
                            icon='chevron_left'
                            onClick={(event) => onPageChange(event, page - 1)}
                            disabled={page === 0} 
                            direction={'row-reverse'}
                        />
                        <ActionButton
                            color='primary'
                            icon='chevron_right'
                            onClick={(event) => onPageChange(event, page + 1)}
                            disabled={page === pageCount - 1}
                        />

                    </Box>
                </Box>
                
            </Box>
    </>
            
    
            
    );
}

export function ServerSideCustomPagination(props: any) {
    return <GridPagination ActionsComponent={serverSidePagination} {...props} />;
}
