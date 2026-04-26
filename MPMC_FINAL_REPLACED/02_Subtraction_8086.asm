.model small
.data
    a db 04h
    b db 03h
.code
    mov ax, @data
    mov ds, ax
    mov al, a
    mov bl, b
    sub al, bl
    int 03h
end
