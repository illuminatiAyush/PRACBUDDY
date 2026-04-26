.model small
.data
    a dw 000fh
    b db 04h
.code
    mov ax, @data
    mov ds, ax
    mov ax, a
    mov bl, b
    div bl
    int 03h
end
