import React from 'react'
import { LoadingButton as MUILoadingButton, LoadingButtonProps } from '@mui/lab'
import { styled } from '@mui/material/styles'

const StyledLoadingButton = styled(MUILoadingButton)(() => ({
    textTransform: 'capitalize',
}))

export const LoadingButton: React.FC<LoadingButtonProps> = (props) => {
    return (
        <StyledLoadingButton
            variant="outlined"
            {...props}
            size="small"
            loadingPosition="end"
            color="primary"
            endIcon={<div className="icon" />}
        />
    )
}
