.model small
.data
    array db 13h, 14h, 07h, 22h, 21h
.code
start:
    mov ax, @data
    mov ds, ax
    mov bx, 05h

Karan:  mov si, offset array
        mov cx, 04h

up:     mov al, [si]
        cmp al, [si+1]
        jc  dn
        xchg al, [si+1]
        xchg al, [si]
dn:     inc si
        loop up

        dec bx
        jnz Karan

        int 03h
end
