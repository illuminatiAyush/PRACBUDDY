.model small
.data
    list db 04h, 05h, 06h, 07h, 08h
    max  db 00h
.code
    mov ax, @data
    mov ds, ax
    mov cx, 05h
    mov si, offset list
    mov al, [si]
    dec cx

entry:  inc si
        cmp al, [si]
        jnc inLis
        mov al, [si]
inLis:  loop entry

        mov max, al
        int 03h
ends
end
