import { Box, Pagination, PaginationItem, TablePagination, TablePaginationProps } from "@mui/material";
import { GridPagination, gridPageCountSelector, useGridApiContext, useGridSelector } from "@mui/x-data-grid";
import { ActionButton } from "../Buttons/ActionButton";

function pagination({
    page,
    onPageChange,
    className,
  }: Pick<TablePaginationProps, 'page' | 'onPageChange' | 'className'>) {
    const apiRef = useGridApiContext();
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);
    
    return (
        <>
            <Pagination
                sx={{display:{xs:'none',md:'block'}}}
                count={pageCount}
                page={page + 1}
                onChange={(event, newPage) => {
                    onPageChange(event as any, newPage - 1);
                }}
                className={className}
                renderItem={(item) => (

                        <PaginationItem
                            slots={{
                                last: (props) => <ActionButton color='error'  icon='keyboard_double_arrow_right' {...props} />,
                                next: (props) =><ActionButton color='primary'  icon='chevron_right' {...props} />,
                                first: (props) => <ActionButton direction='row-reverse' color='warning'  icon='keyboard_double_arrow_left' {...props} />,
                                previous: (props) => <ActionButton direction='row-reverse' color='primary'  icon='chevron_left' {...props} />,
                            }}
                            {...item}
                        />
                    )
                }
                showFirstButton
                showLastButton
                
            />
            <Box sx={{display:{xs:'block',md:'none'},}}>
               <div>personal pagination</div>
            </Box >
            
        </>
            
    );
}

export function CustomPagination(props: any) {
    return <GridPagination ActionsComponent={pagination} {...props} />;
}
