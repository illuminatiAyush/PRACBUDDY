.model small
.data
    a dw 0048h
    b dw 0018h
    res dw 00h
.code
start:
    mov ax, @data
    mov ds, ax
    mov ax, a
    mov bx, b

gcd:    cmp ax, bx
        je  done
        jl  less
        sub ax, bx
        jmp gcd
less:   sub bx, ax
        jmp gcd

done:   mov res, ax
        int 03h
ends
end
