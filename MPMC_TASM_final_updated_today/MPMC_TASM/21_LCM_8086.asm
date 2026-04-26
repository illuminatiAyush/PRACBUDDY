.model small
.data
    a   dw 000ch
    b   dw 0008h
    res dw 00h
.code
start:
    mov ax, @data
    mov ds, ax
    mov ax, a
    mov bx, b
    mov cx, ax
    mov si, bx

gcd:    cmp ax, bx
        je  done
        jl  less
        sub ax, bx
        jmp gcd
less:   sub bx, ax
        jmp gcd

done:   mov bx, ax
        mov ax, cx
        xor dx, dx
        mul si
        div bx
        mov res, ax
        int 03h
ends
end
