.model small
.data
    a db 01h
    b db 08h
.code
    mov ax, @data
    mov ds, ax
    mov al, a
    mov bl, b
    mul bl
    int 03h
end
