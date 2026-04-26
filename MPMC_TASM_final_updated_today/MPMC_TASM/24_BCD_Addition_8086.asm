.model small
.data
    a db 35h
    b db 48h
.code
start:
    mov ax, @data
    mov ds, ax
    mov al, a
    mov bl, b
    add al, bl
    daa
    int 03h
ends
end
