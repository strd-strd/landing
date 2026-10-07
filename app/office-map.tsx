"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { BRAND_SHORT, CONTACTS } from "@/lib/contacts";

const MIN_ZOOM = 12;
const MAX_ZOOM = 18;
const DEFAULT_ZOOM = 15;
const TILE = 256;
/** Максимальный сдвиг вида от офиса — только чтобы глянуть окрестности. */
const MAX_PAN_FROM_OFFICE_PX = 220;

/** Статика Яндекс.Карт без OSM-футера и без стандартных донатов. */
function yandexStaticMapSrc(
  lat: number,
  lon: number,
  width: number,
  height: number,
  zoom: number,
) {
  return `https://static-maps.yandex.ru/1.x/?ll=${lon},${lat}&size=${width},${height}&z=${zoom}&l=map&lang=ru_RU`;
}

function project(lat: number, lon: number) {
  const x = ((lon + 180) / 360) * TILE;
  const sin = Math.sin((lat * Math.PI) / 180);
  const y =
    (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * TILE;
  return { x, y };
}

function unproject(x: number, y: number) {
  const lon = (x / TILE) * 360 - 180;
  const n = Math.PI - (2 * Math.PI * y) / TILE;
  const lat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
  return { lat, lon };
}

function shiftCenter(
  centerLat: number,
  centerLon: number,
  dxPx: number,
  dyPx: number,
  zoom: number,
) {
  const scale = 2 ** zoom;
  const center = project(centerLat, centerLon);
  // Карта уехала вправо → центр сместился на запад
  return unproject(center.x - dxPx / scale, center.y - dyPx / scale);
}

function pinOffsetPx(
  officeLat: number,
  officeLon: number,
  centerLat: number,
  centerLon: number,
  zoom: number,
) {
  const scale = 2 ** zoom;
  const office = project(officeLat, officeLon);
  const center = project(centerLat, centerLon);
  return {
    x: (office.x - center.x) * scale,
    y: (office.y - center.y) * scale,
  };
}

/** Ограничивает центр вида: метка офиса остаётся на своём адресе, далеко не уезжаем. */
function clampCenterToOffice(
  nextLat: number,
  nextLon: number,
  officeLat: number,
  officeLon: number,
  zoom: number,
) {
  const scale = 2 ** zoom;
  const office = project(officeLat, officeLon);
  const next = project(nextLat, nextLon);
  const dx = (next.x - office.x) * scale;
  const dy = (next.y - office.y) * scale;
  const dist = Math.hypot(dx, dy);
  if (dist <= MAX_PAN_FROM_OFFICE_PX) {
    return { lat: nextLat, lon: nextLon };
  }
  const k = MAX_PAN_FROM_OFFICE_PX / dist;
  return unproject(office.x + (dx * k) / scale, office.y + (dy * k) / scale);
}

function clampDragOffset(
  dx: number,
  dy: number,
  centerLat: number,
  centerLon: number,
  officeLat: number,
  officeLon: number,
  zoom: number,
) {
  const shifted = shiftCenter(centerLat, centerLon, dx, dy, zoom);
  const clamped = clampCenterToOffice(
    shifted.lat,
    shifted.lon,
    officeLat,
    officeLon,
    zoom,
  );
  // Обратный пересчёт: какой translate соответствует зажатому центру
  const scale = 2 ** zoom;
  const from = project(centerLat, centerLon);
  const to = project(clamped.lat, clamped.lon);
  return {
    x: (from.x - to.x) * scale,
    y: (from.y - to.y) * scale,
    center: clamped,
  };
}

type OfficeMapProps = {
  className?: string;
  lat?: string;
  lon?: string;
  mapUrl?: string;
  address?: string;
  caption?: string;
  /** Компактный размер для встройки в карточку контакта. */
  compact?: boolean;
};

export function OfficeMap({
  className = "mt-5",
  lat = CONTACTS.mapLat,
  lon = CONTACTS.mapLon,
  mapUrl = CONTACTS.mapUrl,
  address = CONTACTS.address,
  caption,
  compact = false,
}: OfficeMapProps) {
  const officeLat = Number(lat);
  const officeLon = Number(lon);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [center, setCenter] = useState({ lat: officeLat, lon: officeLon });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    moved: boolean;
  } | null>(null);
  const pendingCenterRef = useRef(center);

  const width = compact ? 320 : 650;
  const height = compact ? 200 : 240;
  const label =
    caption ?? `Офис ${BRAND_SHORT}, ${address} — открыть в Яндекс Картах`;

  // Метка всегда на координатах офиса; при панорамировании только смещается вид
  const marker = pinOffsetPx(
    officeLat,
    officeLon,
    center.lat,
    center.lon,
    zoom,
  );

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      moved: false,
    };
    pendingCenterRef.current = center;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const rawX = event.clientX - drag.startX;
    const rawY = event.clientY - drag.startY;
    if (Math.hypot(rawX, rawY) > 3) drag.moved = true;

    const clamped = clampDragOffset(
      rawX,
      rawY,
      center.lat,
      center.lon,
      officeLat,
      officeLon,
      zoom,
    );
    pendingCenterRef.current = clamped.center;
    setDragOffset({ x: clamped.x, y: clamped.y });
  }

  function finishDrag(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    dragRef.current = null;
    setIsDragging(false);

    if (drag.moved) {
      setCenter(pendingCenterRef.current);
    }

    setDragOffset({ x: 0, y: 0 });
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  return (
    <div
      className={`group relative touch-none overflow-hidden rounded-xl border border-border select-none ${className} ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
      role="img"
      aria-label={`Карта: офис ${BRAND_SHORT}, ${address}. Перетащите карту, чтобы посмотреть окрестности.`}
    >
      <div
        className="relative will-change-transform"
        style={{
          transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)`,
        }}
      >
        <Image
          src={yandexStaticMapSrc(center.lat, center.lon, width, height, zoom)}
          alt=""
          width={width}
          height={height}
          draggable={false}
          className={
            compact
              ? "pointer-events-none h-28 w-full object-cover sm:h-full sm:min-h-[7.5rem]"
              : "pointer-events-none h-44 w-full object-cover sm:h-48"
          }
          unoptimized
        />

        {/* Метка только на адресе офиса — отдельно не перетаскивается */}
        <span
          className="pointer-events-none absolute left-1/2 top-1/2 flex flex-col items-center drop-shadow-[0_6px_14px_rgba(0,0,0,0.45)]"
          style={{
            transform: `translate(calc(-50% + ${marker.x}px), calc(-88% + ${marker.y}px))`,
          }}
          aria-hidden="true"
        >
          <span
            className={`flex items-center justify-center rounded-full border-2 border-accent bg-background/95 ring-2 ring-background/40 ${
              compact ? "size-9 p-1" : "size-12 p-1.5 sm:size-14 sm:p-2"
            }`}
          >
            <Image
              src="/logo.svg"
              alt=""
              width={96}
              height={24}
              className={`h-auto w-full object-contain ${
                compact ? "max-w-[1.75rem]" : "max-w-[2.75rem] sm:max-w-[3.25rem]"
              }`}
              unoptimized
            />
          </span>
          <span
            className={`mt-[-1px] h-0 w-0 border-x-transparent border-t-accent ${
              compact
                ? "border-x-[5px] border-t-[7px]"
                : "border-x-[7px] border-t-[10px]"
            }`}
            aria-hidden="true"
          />
        </span>
      </div>

      <div
        className={`absolute right-2 top-2 z-10 flex flex-col overflow-hidden rounded-lg border border-border bg-background/95 shadow-sm ${
          compact ? "gap-0" : ""
        }`}
        role="group"
        aria-label="Масштаб карты"
        onPointerDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setZoom((current) => Math.min(MAX_ZOOM, current + 1))}
          disabled={zoom >= MAX_ZOOM}
          className={`flex cursor-pointer items-center justify-center text-lg font-semibold text-foreground transition-colors hover:bg-card disabled:cursor-not-allowed disabled:opacity-40 ${
            compact ? "size-8" : "size-9 sm:size-10"
          }`}
          aria-label="Приблизить карту"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => setZoom((current) => Math.max(MIN_ZOOM, current - 1))}
          disabled={zoom <= MIN_ZOOM}
          className={`flex cursor-pointer items-center justify-center border-t border-border text-lg font-semibold text-foreground transition-colors hover:bg-card disabled:cursor-not-allowed disabled:opacity-40 ${
            compact ? "size-8" : "size-9 sm:size-10"
          }`}
          aria-label="Отдалить карту"
        >
          −
        </button>
      </div>

      <a
        href={mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.preventDefault();
          window.open(mapUrl, "_blank", "noopener,noreferrer");
        }}
        className={`absolute bottom-2 left-2 z-10 cursor-pointer rounded-md border border-border bg-background/95 px-2 py-1 text-xs text-foreground transition-colors hover:text-accent ${
          compact ? "max-w-[calc(100%-3.5rem)] truncate" : ""
        }`}
        aria-label={`Открыть Яндекс Карты в новом окне: ${CONTACTS.city}, ${address}`}
      >
        {compact ? "Открыть в Яндекс Картах" : label}
      </a>
    </div>
  );
}
