.model small
.data
    array1 db 20h, 13h, 30h, 25h, 34h
    array2 db 00h
.code
start:
    mov ax, @data
    mov ds, ax
    mov cx, 05h
    mov si, offset array1
    mov di, offset array2

Karan:  mov al, [si]
        mov [di], al
        inc si
        inc di
        dec cx
        jnz Karan

        int 03h
end
